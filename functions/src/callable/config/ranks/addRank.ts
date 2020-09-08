import * as functions from 'firebase-functions';
import * as utils from '../../../utils';
import * as admin from 'firebase-admin';
import { Unauthenticated } from '../../../utils/errors';
import IRank from '../../../models/rank.interface';

export interface IAddRankProps {
    rank: IRank;
}

export const addRankCall = functions.https.onCall(
    async (data: IAddRankProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            (await utils.requirePermissions(context.auth?.uid, ['manageRanks'])) ||
            (await utils.requireValidated(data, {
                rank: {
                    ModelRank: ['Name', 'Callsign', 'ImageUrl', 'Permissions'],
                },
            }));

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        await admin.firestore().collection('ranks').add(data.rank);
        /* ******************************************************************* */
        return 1;
    }
);
