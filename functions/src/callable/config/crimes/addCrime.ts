import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as modelsUtil from '../../../utils/models';
import * as admin from 'firebase-admin';
import { Unauthenticated } from '../../../utils/errors';
import ICrime from '../../../models/crime.interface';

export interface IAddCrimeProps {
    crime: ICrime | any;
}

export const addCrimeCall = functions.https.onCall(
    async (data: IAddCrimeProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const Server = await utils.getUserServer(context.auth.uid);
        const error =
            (await utils.requirePermissions(context.auth?.uid, ['manageCrimes'])) ||
            (await utils.requireValidated(data, {
                crime: {
                    ModelCrime: ['Name', 'Penalty', 'Judgment', 'Prefix'],
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const prefixDoc = await modelsUtil.readPrefix(data.crime.Prefix.Id);
        await admin
            .firestore()
            .collection('crimes')
            .add({
                ...data.crime,
                Server,
                Prefix: {
                    ...prefixDoc.data(),
                    Id: prefixDoc.id,
                },
            });
        /* ******************************************************************* */
        return 1;
    }
);
