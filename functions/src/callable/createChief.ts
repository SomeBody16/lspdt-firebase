import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as utils from '../utils';
import * as modelsUtil from '../utils/models';
import { createNewOfficer } from './citizen/recruitCitizen';
import { makeDiscordLog } from '../registry/makeRegistration';

export interface ICreateChiefProps {
    uid: string;
}

export const createChiefCall = functions.https.onCall(
    async (data: ICreateChiefProps, context: functions.https.CallableContext) => {
        const error = await utils.requireValidated(data, {
            uid: {
                validFirebaseId: 'citizens',
            },
        });

        if (error) {
            throw error;
        }
        /* ******************************************************************* */

        // Check if not chief exists
        const adminQuery = await admin
            .firestore()
            .collection('citizens')
            .where('IsChief', '==', true)
            .get();
        if (!adminQuery.empty) {
            throw new functions.https.HttpsError('already-exists', 'Chief already exists', {
                chief: adminQuery.docs,
            });
        }

        const citizenDoc = await modelsUtil.readCitizen(data.uid);

        const newUserRequest = await createNewOfficer(citizenDoc);
        await admin.auth().setCustomUserClaims(newUserRequest.uid || '', {
            admin: true,
            permissions: [],
        });
        await citizenDoc.ref.update('IsChief', true);
        await admin
            .firestore()
            .collection('officers')
            .doc(newUserRequest?.uid || '')
            .update('Citizen.IsChief', true);

        /* ******************************************************************* */
        await makeDiscordLog({
            channel: 'accounts',
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
