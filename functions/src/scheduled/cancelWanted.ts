import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const cancelWantedScheduleCall = functions.pubsub
    .schedule('0 0 * * )')
    .timeZone('Europe/Warsaw')
    .onRun(async (context) => {

        const citizens = await admin.firestore()
            .collection('citizens')
            .get();

    });
