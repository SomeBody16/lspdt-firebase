import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as modelsUtil from '../../utils/models';
import { Unauthenticated } from '../../utils/errors';
import { makeRegistration } from '../../registry/makeRegistration';
import ICitizen from '../../models/citizen.interface';
import IOfficer from '../../models/officer.interface';

export interface IUpdateOfficerBadgeNumberProps {
    officerId: string;
    badgeNumber: string;
}

export const updateOfficerBadgeNumberCall = functions.https.onCall(
    async (data: IUpdateOfficerBadgeNumberProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['changeOfficerBadgeNumber'])) ||
            (await utils.requireValidated(
                {
                    ...data,
                    officer: {
                        BadgeNumber: data.badgeNumber,
                    },
                },
                {
                    officerId: {
                        validFirebaseId: 'officers',
                    },
                    officer: {
                        ModelOfficer: ['BadgeNumber'],
                    },
                }
            ));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const officerDoc = await modelsUtil.readOfficer(data.officerId);
        await officerDoc.ref.update('BadgeNumber', data.badgeNumber);
        /* ******************************************************************* */
        const citizenDoc = await modelsUtil.readCitizen(officerDoc.data()?.Citizen.Id || '');
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
                        Content: ':1234:',
                        Description: 'Zmiana numeru odznaki',
                    },
                ],
                Title: 'Zmiana numeru odznaki',
                ImageUrl: citizenDoc.get('ImageUrl'),
            },
            {
                channel: 'registry',
                title: 'Zmiana numeru odznaki',
                customMessage: (msg) =>
                    msg
                        .addField(':older_man:', officerDoc.data()?.BadgeNumber || '')
                        .addField(':new:', data.badgeNumber),
            }
        );

        return 1;
    }
);
