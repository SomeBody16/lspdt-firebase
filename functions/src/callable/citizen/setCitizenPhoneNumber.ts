import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as modelsUtil from '../../utils/models';
import { Unauthenticated } from '../../utils/errors';
import { makeRegistration } from '../../registry/makeRegistration';
import ICitizen from '../../models/citizen.interface';
import IOfficer from '../../models/officer.interface';

export interface ISetCitizenPhoneNumberProps {
    citizenId: string;
    phoneNumber: string;
}

export const setCitizenPhoneNumberCall = functions.https.onCall(
    async (data: ISetCitizenPhoneNumberProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['setCitizenPhoneNumber'])) ||
            (await utils.requireValidated(
                {
                    citizen: {
                        Id: data.citizenId,
                        PhoneNumber: data.phoneNumber,
                    },
                },
                {
                    citizen: {
                        ModelCitizen: ['Id', 'PhoneNumber'],
                    },
                }
            ));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */

        const citizenDoc = await modelsUtil.readCitizen(data.citizenId);
        await citizenDoc.ref.update({
            PhoneNumber: data.phoneNumber,
        });

        if (citizenDoc.data()?.IsOfficer) {
            const officerCitizenDoc = await modelsUtil
                .readOfficerByCitizenId(data.citizenId)
                .catch(() => null);

            if (officerCitizenDoc && officerCitizenDoc.exists) {
                await officerCitizenDoc.ref.update('Citizen.PhoneNumber', data.phoneNumber);
            }
        }

        /* ******************************************************************* */
        const officerDoc = await modelsUtil.readOfficer(context.auth.uid);
        await makeRegistration(
            {
                Citizen: {
                    ...(citizenDoc.data() as ICitizen),
                    Id: citizenDoc.id,
                },
                OfficerAuthor: {
                    ...(officerDoc.data() as IOfficer),
                    Id: officerDoc.id,
                },
                Prefixes: [
                    {
                        Id: '',
                        Content: ':telephone:',
                        Description: 'phoneChange',
                    },
                ],
                Title: 'phoneChange',
                Description: `${citizenDoc.data()?.PhoneNumber || ''} => ${data.phoneNumber}`,
                ImageUrl: citizenDoc.get('ImageUrl'),
            },
            {
                channel: 'registry',
                title: 'Phone change',
                customMessage: (msg) =>
                    msg
                        .setDescription('')
                        .addField('Old', citizenDoc.data()?.PhoneNumber || '')
                        .addField('New', data.phoneNumber),
            }
        );

        return 1;
    }
);
