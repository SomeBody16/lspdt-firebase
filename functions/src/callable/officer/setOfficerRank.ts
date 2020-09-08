import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as modelsUtil from '../../utils/models';
import * as admin from 'firebase-admin';
import { Unauthenticated } from '../../utils/errors';
import { makeRegistration } from '../../registry/makeRegistration';
import ICitizen from '../../models/citizen.interface';
import IOfficer from '../../models/officer.interface';

export interface ISetOfficerRankProps {
    officerId: string;
    rankId: string;
}

export const setOfficerRankCall = functions.https.onCall(
    async (data: ISetOfficerRankProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['changeOfficerRank'])) ||
            (await utils.requireValidated(data, {
                officerId: {
                    validFirebaseId: 'officers',
                },
                rankId: {
                    validFirebaseId: 'ranks',
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const officerDoc = await modelsUtil.readOfficer(data.officerId);
        const rankDoc = await modelsUtil.readRank(data.rankId);

        await officerDoc.ref.update('Rank', {
            ...rankDoc.data(),
            Id: rankDoc.id,
        });

        const officerUser = await admin.auth().getUser(officerDoc.id);
        await admin.auth().setCustomUserClaims(officerDoc.id, {
            ...officerUser.customClaims,
            permissions: rankDoc.data()?.Permissions || [],
        });
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
                        Content: ':chart_with_upwards_trend::chart_with_downwards_trend:',
                        Description: 'rankChange',
                    },
                ],
                Title: 'rankChange',
                ImageUrl: citizenDoc.get('ImageUrl'),
            },
            {
                channel: 'registry',
                title: 'Rank change',
                customMessage: (msg) =>
                    msg
                        .addField(
                            'Old',
                            `${officerDoc.data()?.Rank.Callsign} | ${officerDoc.data()?.Rank.Name}`
                        )
                        .addField('New', `${rankDoc.data()?.Callsign} | ${rankDoc.data()?.Name}`),
            }
        );

        return 1;
    }
);
