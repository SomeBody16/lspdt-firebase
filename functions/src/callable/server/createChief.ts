import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as utils from '../../utils';
import * as modelsUtil from '../../utils/models';
import { createNewOfficer } from '../citizen/recruitCitizen';
import { makeDiscordLog } from '../../registry/makeRegistration';

export interface ICreateChiefProps {
    uid: string;
    password: string;
    server: string;
}

export const createChiefCall = functions.https.onCall(
    async (data: ICreateChiefProps, context: functions.https.CallableContext) => {
        const error = await utils.requireValidated(data, {
            uid: {
                validFirebaseId: 'citizens',
            },
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

        // Check if not chief exists
        const adminQuery = await admin
            .firestore()
            .collection('citizens')
            .where('IsChief', '==', true)
            .where('Server', '==', data.server)
            .get();
        if (!adminQuery.empty) {
            throw new functions.https.HttpsError('already-exists', 'Chief already exists', {
                chief: adminQuery.docs,
            });
        }

        const citizenDoc = await modelsUtil.readCitizen(data.uid);

        const newUserRequest = await createNewOfficer(citizenDoc, data.server);
        await admin.auth().setCustomUserClaims(newUserRequest.uid || '', {
            admin: true,
            permissions: [],
            Server: data.server,
        });
        await citizenDoc.ref.update('IsChief', true);
        await admin
            .firestore()
            .collection('officers')
            .doc(newUserRequest?.uid || '')
            .update('Citizen.IsChief', true);

        /* ******************************************************************* */
        await makeDiscordLog({
            Server: data.server,
            channel: 'log',
            title: 'CHIEF ACCOUNT',
            customMessage: (msg) =>
                msg
                    .setColor(0xff0000)
                    .addField('**:e_mail: E-mail**', newUserRequest?.email || '')
                    .addField('**:lock: Password**', newUserRequest?.password || ''),
        });

        return 1;
    }
);
