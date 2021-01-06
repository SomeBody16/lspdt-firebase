import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as modelsUtil from '../../../utils/models';
import { Unauthenticated } from '../../../utils/errors';
import ICrime from '../../../models/crime.interface';
import { makeRegistration } from '../../../registry/makeRegistration';
import ICitizen from '../../../models/citizen.interface';
import IOfficer from '../../../models/officer.interface';

export interface IConfirmArrestMandateProps {
    citizenId: string;
    crimesIds: string[];
    author: string;
    penalty: number,
    judgment: number,
}

export const confirmArrestMandateCall = functions.https.onCall(
    async (data: IConfirmArrestMandateProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const Server = await utils.getUserServer(context.auth.uid);
        const error =
            (await utils.requirePermissions(context.auth?.uid, ['accessArrestMandate'])) ||
            (await utils.requireValidated(data, {
                citizenId: {
                    validFirebaseId: 'citizens',
                },
                author: {
                    presence: true,
                    type: 'string',
                },
                crimesIds: {
                    type: 'array',
                    validFirebaseIds: 'crimes',
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const citizenDoc = await modelsUtil.readCitizen(data.citizenId);

        const crimes: ICrime[] = [];
        for (const crimeId of data.crimesIds) {
            const crime = await modelsUtil.readCrime(crimeId);
            crimes.push({
                ...(crime.data() as ICrime),
                Id: crime.id,
            });
        }

        const recidivismIdsTmp: string[] = [];
        const citizenRecidivism = citizenDoc.get('Recidivism') || {} as ICitizen['Recidivism'];
        for (const crime of crimes.filter(c => c.Recidivism)) {
            if (!recidivismIdsTmp.includes(crime.Id)) {
                if (crime.Id in citizenRecidivism) {
                    citizenRecidivism[crime.Id]++;
                }
                else {
                    citizenRecidivism[crime.Id] = 1;
                }
                recidivismIdsTmp.push(crime.Id);
            }
        }

        await citizenDoc.ref.update({
            IsWanted: false,
            WantedCrimesIds: [],
            Recidivism: citizenRecidivism
        });

        /* ******************************************************************* */
        const officerDoc = await modelsUtil.readOfficer(context.auth.uid);

        const penalty = Intl.NumberFormat('pl', {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0
        }).format(data.penalty);

        const Title = `${data.judgment}tyg | ${penalty}`;
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
                Prefixes: crimes
                    .map((c) => c.Prefix)
                    .filter(
                        (value, index, self) => self.findIndex((p) => p.Id === value.Id) === index
                    ),
                Title,
                Description: data.author,
                Crimes: crimes,
                ImageUrl: citizenDoc.get('ImageUrl'),
            },
            {
                channel: 'punishments',
                title: 'Aresztowanie | Faktura',
                customMessage: (msg) =>
                    msg
                        .addField('Powód', crimes.map((c) => c.Name).join(', ') + ' ')
                        .addField('Grzywna', data.penalty.toString())
                        .addField('Odsiadka', data.judgment.toString()),
            }
        )
            .catch(console.error);

        return 1;
    }
);
