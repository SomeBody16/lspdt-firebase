import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as modelsUtil from '../../../utils/models';
import { Unauthenticated } from '../../../utils/errors';
import ICrime from '../../../models/crime.interface';

export interface IEditCrimeProps {
    crime: ICrime;
}

export const editCrimeCall = functions.https.onCall(
    async (data: IEditCrimeProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['manageCrimes'])) ||
            (await utils.requireValidated(data, {
                crime: {
                    ModelCrime: [],
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const crimeDoc = await modelsUtil.readCrime(data.crime.Id);
        const prefixDoc = await modelsUtil.readPrefix(data.crime.Prefix.Id);
        await crimeDoc.ref.update({
            ...crimeDoc.data(),
            ...data.crime,
            Prefix: {
                ...prefixDoc.data(),
                Id: prefixDoc.id,
            },
        });
        /* ******************************************************************* */
        return 1;
    }
);
