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

        const Server = await utils.getUserServer(context.auth.uid);
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
                Server,
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
                        Server,
                        Id: '',
                        Content: ':telephone:',
                        Description: 'Zmiana numeru',
                    },
                ],
                Title: 'Nowy numer telefonu',
                Description: `${citizenDoc.data()?.PhoneNumber || ''} => ${data.phoneNumber}`,
                ImageUrl: citizenDoc.get('ImageUrl'),
            },
            {
                channel: 'registry',
                title: 'Nowy numer telefonu',
                customMessage: (msg) =>
                    msg
                        .setDescription('')
                        .addField(':older_man:', citizenDoc.data()?.PhoneNumber || '')
                        .addField(':new:', data.phoneNumber),
            }
        );

        return 1;
    }
);
