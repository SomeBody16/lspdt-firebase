import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as modelsUtil from '../../../utils/models';
import { Unauthenticated, OfficerWithThisRankExists } from '../../../utils/errors';
import * as admin from 'firebase-admin';
import IRank from '../../../models/rank.interface';
import IOfficer from '../../../models/officer.interface';

export interface IDeleteRankProps {
    rankId: string;
}

export const deleteRankCall = functions.https.onCall(
    async (data: IDeleteRankProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['manageRanks'])) ||
            (await utils.requireValidated(data, {
                rankId: {
                    validFirebaseId: 'ranks',
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const rankDoc = await modelsUtil.readRank(data.rankId);

        const officersOfRankQuery = await admin
            .firestore()
            .collection('officers')
            .where('Rank.Id', '==', rankDoc.id)
            .get();

        if (!officersOfRankQuery.empty) {
            throw OfficerWithThisRankExists(
                rankDoc.data() as IRank,
                officersOfRankQuery.docs.map((d) => d.data() as IOfficer)
            );
        }

        await rankDoc.ref.delete();
        /* ******************************************************************* */
        return 1;
    }
);
