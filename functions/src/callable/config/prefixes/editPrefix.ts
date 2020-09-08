import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as modelsUtil from '../../../utils/models';
import { Unauthenticated } from '../../../utils/errors';
import IPrefix from '../../../models/prefix.interface';

export interface IEditPrefixProps {
    prefix: IPrefix;
}

export const editPrefixCall = functions.https.onCall(
    async (data: IEditPrefixProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['managePrefixes'])) ||
            (await utils.requireValidated(data, {
                prefix: {
                    ModelPrefix: [],
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const prefixDoc = await modelsUtil.readPrefix(data.prefix.Id);
        await prefixDoc.ref.update({
            ...prefixDoc.data(),
            ...data.prefix,
        });
        /* ******************************************************************* */
        return 1;
    }
);
