import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as admin from 'firebase-admin';
import * as modelsUtil from '../../utils/models';
import ICitizen from '../../models/citizen.interface';
import { Unauthenticated } from '../../utils/errors';
import { makeRegistration } from '../../registry/makeRegistration';
import IOfficer from '../../models/officer.interface';

export interface ICreateCitizenProps {
    uid: string;
    citizen: ICitizen; // Name, Surname, BirthDate
}

export const createCitizenCall = functions.https.onCall(
    async (data: ICreateCitizenProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error = await utils.requireValidated(data, {
            uid: {
                presence: true,
                type: 'string',
            },
            citizen: {
                ModelCitizen: ['Name', 'Surname', 'BirthDate'],
            },
        });

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const citizenDocData: ICitizen = {
            ...data.citizen,
            Id: data.uid,
            CreateTime: Date.now(),
            IsOfficer: false,
            IsWanted: false,
            IsChief: false,
        };

        await admin.firestore().collection('citizens').doc(data.uid).set(citizenDocData);
        /* ******************************************************************* */
        const officerDoc = await modelsUtil.readOfficer(context.auth.uid);
        const idScan = admin.storage().bucket('citizens-ids').file(data.uid);
        await idScan.makePublic();
        const ImageUrl = `https://storage.googleapis.com/citizens-ids/${data.uid}`;
        await makeRegistration(
            {
                Citizen: citizenDocData,
                OfficerAuthor: {
                    ...(officerDoc.data() as IOfficer),
                    Id: officerDoc.id,
                },
                Prefixes: [
                    {
                        Id: '',
                        Content: ':open_file_folder:',
                        Description: 'Otwarcie kartoteki',
                    },
                ],
                Title: 'Otwarcie kartoteki',
                ImageUrl,
            },
            {
                channel: 'registry',
                title: 'Otwarcie kartoteki',
                customMessage: (msg) => msg.setDescription('').setImage(ImageUrl),
            }
        );

        return 1;
    }
);
