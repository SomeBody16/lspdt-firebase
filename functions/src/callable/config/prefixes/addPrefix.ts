import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as admin from 'firebase-admin';
import { Unauthenticated } from '../../../utils/errors';
import IPrefix from '../../../models/prefix.interface';

export interface IAddPrefixProps {
    prefix: IPrefix | any;
}

export const addPrefixCall = functions.https.onCall(
    async (data: IAddPrefixProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const Server = await utils.getUserServer(context.auth.uid);
        const error =
            (await utils.requirePermissions(context.auth?.uid, ['managePrefixes'])) ||
            (await utils.requireValidated(data, {
                prefix: {
                    ModelPrefix: ['Content', 'Description'],
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        await admin
            .firestore()
            .collection('prefixes')
            .add({ ...data.prefix, Server });
        /* ******************************************************************* */
        return 1;
    }
);
