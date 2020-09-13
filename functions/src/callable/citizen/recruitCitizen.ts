import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as admin from 'firebase-admin';
import * as modelsUtil from '../../utils/models';
import { Unauthenticated } from '../../utils/errors';
import ICitizen from '../../models/citizen.interface';
import { makeRegistration, IDiscordLogOptions } from '../../registry/makeRegistration';
import IOfficer from '../../models/officer.interface';

export interface IRecruitCitizenProps {
    citizenId: string;
}

export const recruitCitizenCall = functions.https.onCall(
    async (data: IRecruitCitizenProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['recruitOfficer'])) ||
            (await utils.requireValidated(data, {
                citizenId: {
                    validFirebaseId: 'citizens',
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const citizenDoc = await modelsUtil.readCitizen(data.citizenId);
        let newUserRequest: admin.auth.CreateRequest | undefined;

        const query = await admin
            .firestore()
            .collection('officers')
            .where('Citizen.Id', '==', data.citizenId)
            .get();

        if (query.empty) {
            newUserRequest = await createNewOfficer(citizenDoc);
        } else {
            // Officer exists, turn him on
            const newOfficerDoc = query.docs[0];

            await admin.auth().updateUser(newOfficerDoc.id, { disabled: false });
            await admin.firestore().runTransaction(async (transaction) => {
                transaction.update(citizenDoc.ref, 'IsOfficer', true);
                transaction.update(newOfficerDoc.ref, {
                    ...newOfficerDoc.data(),
                    Id: newOfficerDoc.id,
                    IsFired: false,
                });
            });
        }

        /* ******************************************************************* */
        const officerDoc = await modelsUtil.readOfficer(context.auth.uid);
        const discordLogOptions: IDiscordLogOptions[] = [
            {
                channel: 'registry',
                title: 'Nowy policjant',
                customMessage: (msg) =>
                    msg.addField(
                        'Ranga',
                        `${officerDoc.get('Rank.Callsign')} | ${officerDoc.get('Rank.Name')}`
                    ),
            },
        ];

        if (newUserRequest) {
            discordLogOptions.push({
                channel: 'accounts',
                title: 'Nowe konto',
                customMessage: (msg) =>
                    msg
                        .addField('**:e_mail: E-mail**', newUserRequest?.email || '')
                        .addField('**:lock: Hasło**', newUserRequest?.password || ''),
            });
        }

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
                        Content: ':new::cop:',
                        Description: 'Nowy policjant',
                    },
                ],
                Title: 'Nowy policjant',
                ImageUrl: citizenDoc.get('ImageUrl'),
            },
            discordLogOptions
        );

        return 1;
    }
);

export const createNewOfficer = async (
    citizenDoc: FirebaseFirestore.DocumentSnapshot<ICitizen>
): Promise<admin.auth.CreateRequest> => {
    const userCreateRequest: admin.auth.CreateRequest = {
        email: `${citizenDoc.data()?.Name}.${citizenDoc.data()?.Surname}@lspdt.com`.toLowerCase(),
        emailVerified: true,
        password: utils.generatePassword(10),
        displayName: `${citizenDoc.data()?.Name} ${citizenDoc.data()?.Surname}`,
        disabled: false,
    };
    const newUser = await admin.auth().createUser(userCreateRequest);

    // Create new rank if default not exists
    const defaultRankDoc = await modelsUtil.readRank('default');

    await admin
        .firestore()
        .collection('officers')
        .doc(newUser.uid)
        .set({
            BadgeNumber: '--',
            IsFired: false,
            Citizen: {
                ...citizenDoc.data(),
                Id: citizenDoc.id,
            },
            Rank: {
                ...defaultRankDoc.data(),
                Id: defaultRankDoc.id,
            },
        });

    await citizenDoc.ref.update('IsOfficer', true);

    return {
        ...userCreateRequest,
        uid: newUser.uid,
    };
};
