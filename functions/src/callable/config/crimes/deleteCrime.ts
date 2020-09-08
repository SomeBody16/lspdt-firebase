import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as modelsUtil from '../../../utils/models';
import { Unauthenticated } from '../../../utils/errors';

export interface IDeleteCrimeProps {
    crimeId: string;
}

export const deleteCrimeCall = functions.https.onCall(
    async (data: IDeleteCrimeProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['manageCrimes'])) ||
            (await utils.requireValidated(data, {
                crimeId: {
                    validFirebaseId: 'crimes',
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const crimeDoc = await modelsUtil.readCrime(data.crimeId);
        await crimeDoc.ref.delete();
        /* ******************************************************************* */
        return 1;
    }
);
