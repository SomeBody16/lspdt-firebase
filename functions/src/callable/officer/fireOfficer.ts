import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as modelsUtil from '../../utils/models';
import * as admin from 'firebase-admin';
import { Unauthenticated } from '../../utils/errors';
import { makeRegistration } from '../../registry/makeRegistration';
import ICitizen from '../../models/citizen.interface';
import IOfficer from '../../models/officer.interface';

export interface IFireOfficerProps {
    officerId: string;
}

export const fireOfficerCall = functions.https.onCall(
    async (data: IFireOfficerProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['fireOfficer'])) ||
            (await utils.requireValidated(data, {
                officerId: {
                    validFirebaseId: 'officers',
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const officerDoc = await modelsUtil.readOfficer(data.officerId);
        const citizenDoc = await modelsUtil.readCitizen(officerDoc.data()?.Citizen.Id || '');

        await admin.auth().updateUser(data.officerId, { disabled: true });
        await admin.firestore().runTransaction(async (transaction) => {
            transaction.update(citizenDoc.ref, 'IsOfficer', false);
            transaction.update(officerDoc.ref, {
                ...officerDoc.data(),
                Id: officerDoc.id,
                BadgeNumber: '--',
                IsFired: true,
            });
        });
        /* ******************************************************************* */
        const officerAuthorDoc = await modelsUtil.readOfficer(context.auth.uid);
        await makeRegistration(
            {
                Citizen: {
                    ...(citizenDoc.data() as ICitizen),
                    Id: citizenDoc.id,
                },
                OfficerAuthor: {
                    ...(officerAuthorDoc.data() as IOfficer),
                    Id: officerAuthorDoc.id,
                },
                Prefixes: [
                    {
                        Id: '',
                        Content: ':x:',
                        Description: 'Zwolnienie',
                    },
                ],
                Title: 'Zwolniony ze służby',
                ImageUrl: citizenDoc.get('ImageUrl'),
            },
            {
                channel: 'registry',
                title: 'Zwolnienie',
            }
        );

        return 1;
    }
);
