import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import {Unauthenticated} from '../../../utils/errors';
import * as modelsUtil from '../../../utils/models';
import ICitizen from "../../../models/citizen.interface";
import {makeRegistration} from "../../../registry/makeRegistration";
import IOfficer from "../../../models/officer.interface";
import ICrime from "../../../models/crime.interface";

export interface IChangeRecidivismProps {
    citizenId: string;
    crimeId: string;
    value: -1 | 1;
}

export const changeRecidivismCall = functions.https.onCall(
    async (data: IChangeRecidivismProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const Server = await utils.getUserServer(context.auth.uid);
        const error =
            (await utils.requirePermissions(context.auth?.uid, ['changeRecidivism'])) ||
            (await utils.requireValidated(
                {
                    ...data,
                },
                {
                    citizenId: {
                        validFirebaseId: 'citizens',
                    },
                    crimeId: {
                        validFirebaseId: 'crimes',
                    }
                }
            ));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const citizenDoc = await modelsUtil.readCitizen(data.citizenId);
        const crimeDoc = await modelsUtil.readCrime(data.crimeId);

        const Recidivism = citizenDoc.get('Recidivism') || {} as ICitizen['Recidivism'];
        const value = data.value === 1 ? 1 : -1;

        if (crimeDoc.id in Recidivism) {
            Recidivism[crimeDoc.id] += value;
        } else {
            Recidivism[crimeDoc.id] = value;
        }

        if (Recidivism[crimeDoc.id] < 0) {
            return 1;
        }

        await citizenDoc.ref.update({Recidivism});

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
                        Content: ':regional_indicator_r:',
                        Description: 'Manualna zmiana poziomu recydywy',
                    },
                ],
                Title: 'Manualna zmiana poziomu recydywy',
                Description: `${Recidivism[crimeDoc.id] - value} => ${Recidivism[crimeDoc.id]}`,
                Crimes: [crimeDoc.data() as ICrime],
                ImageUrl: citizenDoc.get('ImageUrl'),
            },
            {
                channel: 'registry',
                title: 'Manualna zmiana poziomu recydywy',
                customMessage: (msg) =>
                    msg
                        .setDescription(crimeDoc.data()?.Name || '')
                        .addField(':older_man:', (Recidivism[crimeDoc.id] - value).toString() || '')
                        .addField(':new:', Recidivism[crimeDoc.id].toString() || ''),
            }
        );

        return 1;
    }
);
