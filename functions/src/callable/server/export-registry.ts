import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as utils from '../../utils';

export interface IExportRegistryProps {
    uid: string;
    password: string;
    server: string;
}

export const exportRegistryCall = functions.https.onCall(
    async (data: IExportRegistryProps, context: functions.https.CallableContext) => {
        const error = await utils.requireValidated(data, {
            password: {
                presence: true,
                type: 'string',
            },
        });

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const serverDoc = await admin.firestore().collection('server').doc(data.server).get();

        const serverPassword = serverDoc.get('Password');
        if (!serverPassword || serverPassword !== data.password) {
            throw new functions.https.HttpsError('unauthenticated', 'Invalid server password');
        }


        const registry = await admin
            .firestore()
            .collection('registry')
            .where('CreateTime', '>=', Date.now() - (1000 * 60 * 60 * 24 * 7))
            .get();

        return registry.docs.map(doc => ({
            ...doc.data(),
            Id: doc.id
        }));
    }
);
