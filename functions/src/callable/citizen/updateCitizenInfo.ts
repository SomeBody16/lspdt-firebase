import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as modelsUtil from '../../utils/models';
import { Unauthenticated } from '../../utils/errors';
import { makeRegistration } from '../../registry/makeRegistration';
import ICitizen from '../../models/citizen.interface';
import IOfficer from '../../models/officer.interface';

export interface IUpdateCitizenInfoProps {
    citizenId: string;
    BirthDate: string;
    Height: string;
}

export const updateCitizenInfoCall = functions.https.onCall(
    async (data: IUpdateCitizenInfoProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const Server = await utils.getUserServer(context.auth.uid);
        const error =
            (await utils.requirePermissions(context.auth?.uid, ['updateCitizenInfo'])) ||
            (await utils.requireValidated(
                {
                    citizen: {
                        Id: data.citizenId,
                        BirthDate: data.BirthDate,
                        Height: data.Height,
                    },
                },
                {
                    citizen: {
                        ModelCitizen: ['Id', 'BirthDate', 'Height'],
                    },
                }
            ));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const updateData = {
            BirthDate: data.BirthDate,
            Height: data.Height,
        };

        const citizenDoc = await modelsUtil.readCitizen(data.citizenId);
        await citizenDoc.ref.update(updateData);

        if (citizenDoc.data()?.IsOfficer) {
            const officerCitizenDoc = await modelsUtil
                .readOfficerByCitizenId(data.citizenId)
                .catch(() => null);

            if (officerCitizenDoc && officerCitizenDoc.exists) {
                await officerCitizenDoc.ref.update(updateData);
            }
        }

        /* ******************************************************************* */
        const officerDoc = await modelsUtil.readOfficer(context.auth.uid);
        makeRegistration(
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
                        Content: ':arrow_up:',
                        Description: 'Aktualizacja informacji',
                    },
                ],
                Title: 'Aktualizacja informacji',
                Description:
                    `${citizenDoc.get('BirthDate')} => ${data.BirthDate}\n` +
                    `${citizenDoc.get('Height')} => ${data.Height}`,
                ImageUrl: citizenDoc.get('ImageUrl'),
            },
            {
                channel: 'registry',
                title: 'Aktualizacja informacji',
                customMessage: (msg) =>
                    msg
                        .setDescription('')
                        .addField('Data urodzenia', data.BirthDate || '')
                        .addField('Wzrost', data.Height || ''),
            }
        )
            .catch(console.error);

        return 1;
    }
);
