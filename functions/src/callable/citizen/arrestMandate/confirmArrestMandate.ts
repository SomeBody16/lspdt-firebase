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
}

export const confirmArrestMandateCall = functions.https.onCall(
    async (data: IConfirmArrestMandateProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

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

        await citizenDoc.ref.update({
            IsWanted: false,
            WantedCrimesIds: [],
        });

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
                Prefixes: crimes
                    .map((c) => c.Prefix)
                    .filter(
                        (value, index, self) => self.findIndex((p) => p.Id === value.Id) === index
                    ),
                Title: '{{penalty}} | {{judgment}}',
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
                        .addField(
                            'Grzywna',
                            crimes
                                .map((c) => +c.Penalty)
                                .reduce((prev, curr) => prev + curr, 0)
                                .toString() + ' '
                        )
                        .addField(
                            'Odsiadka',
                            crimes
                                .map((c) => +c.Judgment)
                                .reduce((prev, curr) => prev + curr, 0)
                                .toString() + ' '
                        ),
            }
        );

        return 1;
    }
);
