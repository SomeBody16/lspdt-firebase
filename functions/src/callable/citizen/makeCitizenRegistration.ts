import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import { Unauthenticated } from '../../utils/errors';
import * as modelsUtil from '../../utils/models';
import { makeRegistration } from '../../registry/makeRegistration';
import ICitizen from '../../models/citizen.interface';
import IOfficer from '../../models/officer.interface';
import IPrefix from '../../models/prefix.interface';

export interface IMakeRegistrationProps {
    citizenId: string;
    title: string;
    description: string;
    prefixesIds: string[];
}

export const makeCitizenRegistrationCall = functions.https.onCall(
    async (data: IMakeRegistrationProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const Server = await utils.getUserServer(context.auth.uid);
        const error =
            (await utils.requirePermissions(context.auth?.uid, ['makeCitizenRegistration'])) ||
            (await utils.requireValidated(
                {
                    ...data,
                    registration: {
                        Title: data.title,
                        Description: data.description,
                    },
                },
                {
                    citizenId: {
                        validFirebaseId: 'citizens',
                    },
                    registration: {
                        ModelRegistration: ['Title', 'Description'],
                    },
                    prefixesIds: {
                        validFirebaseIds: 'prefixes',
                    },
                }
            ));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const citizenDoc = await modelsUtil.readCitizen(data.citizenId);
        const officerDoc = await modelsUtil.readOfficer(context.auth.uid);

        const prefixes: IPrefix[] = [];
        for (const prefixId of data.prefixesIds) {
            const prefix = await modelsUtil.readPrefix(prefixId);
            prefixes.push({
                ...(prefix.data() as IPrefix),
                Id: prefix.id,
            });
        }

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
                Prefixes: prefixes,
                Title: data.title,
                Description: data.description,
            },
            {
                channel: 'registry',
                title: data.title,
            }
        )
            .catch(console.error);

        return 1;
    }
);
