import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as modelsUtil from '../../../utils/models';
import { Unauthenticated } from '../../../utils/errors';

export interface IDeletePrefixProps {
    prefixId: string;
}

export const deletePrefixCall = functions.https.onCall(
    async (data: IDeletePrefixProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['managePrefixes'])) ||
            (await utils.requireValidated(data, {
                prefixId: {
                    validFirebaseId: 'prefixes',
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const prefixDoc = await modelsUtil.readPrefix(data.prefixId);
        await prefixDoc.ref.delete();
        /* ******************************************************************* */
        return 1;
    }
);
