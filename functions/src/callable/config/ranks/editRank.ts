import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as admin from 'firebase-admin';
import * as modelsUtil from '../../../utils/models';
import { Unauthenticated } from '../../../utils/errors';
import IRank from '../../../models/rank.interface';

export interface IEditRankProps {
    rank: IRank;
}

export const editRankCall = functions.https.onCall(
    async (data: IEditRankProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['manageRanks'])) ||
            (await utils.requireValidated(data, {
                rank: {
                    ModelRank: [],
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const rankDoc = await modelsUtil.readRank(data.rank.Id);
        await rankDoc.ref.update({
            ...rankDoc.data(),
            ...data.rank,
        });

        const officersOfRankQuery = await admin
            .firestore()
            .collection('officers')
            .where('Rank.Id', '==', rankDoc.id)
            .get();

        for (const officerDoc of officersOfRankQuery.docs) {
            const officerUser = await admin.auth().getUser(officerDoc.id);
            await admin.auth().setCustomUserClaims(officerDoc.id, {
                ...officerUser.customClaims,
                permissions: data.rank.Permissions,
            });
        }
        /* ******************************************************************* */
        return 1;
    }
);
