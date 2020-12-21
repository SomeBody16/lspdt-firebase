import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import { Unauthenticated } from '../../utils/errors';
import * as modelsUtil from '../../utils/models';

export interface IRemoveRegistrationProps {
    registrationId: string;
    citizenId: string;
}

export const removeRegistrationCall = functions.https.onCall(
    async (data: IRemoveRegistrationProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['removeRegistration'])) ||
            (await utils.requireValidated(
                {
                    ...data,
                },
                {
                    citizenId: {
                        validFirebaseId: 'citizens',
                    },
                    registrationId: {
                        validFirebaseId: 'registry',
                    }
                }
            ));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const registrationDoc = await modelsUtil.readRegistration(data.registrationId);

        await registrationDoc.ref.delete();

        return 1;
    }
);
