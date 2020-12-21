import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import { Unauthenticated } from '../../utils/errors';
import * as modelsUtil from '../../utils/models';
import { makeRegistration } from '../../registry/makeRegistration';
import ICitizen from '../../models/citizen.interface';
import IOfficer from '../../models/officer.interface';

export interface ICancelWantedProps {
    citizenId: string;
}

export const cancelWantedCall = functions.https.onCall(
    async (data: ICancelWantedProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const Server = await utils.getUserServer(context.auth.uid);
        const error =
            (await utils.requirePermissions(context.auth?.uid, ['makeCitizenRegistration'])) ||
            (await utils.requireValidated(
                {
                    ...data,
                },
                {
                    citizenId: {
                        validFirebaseId: 'citizens',
                    },
                }
            ));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const citizenDoc = await modelsUtil.readCitizen(data.citizenId);
        const officerDoc = await modelsUtil.readOfficer(context.auth.uid);

        await citizenDoc.ref.update({
            IsWanted: false,
            WantedCrimesIds: [],
        } as Partial<ICitizen>);

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
                        Content: ':spy:',
                        Description: 'wanted',
                    },
                ],
                Title: 'Anulowanie poszukiwań',
            },
            {
                channel: 'registry',
                title: 'Anulowanie poszukiwań',
            }
        );

        return 1;
    }
);
