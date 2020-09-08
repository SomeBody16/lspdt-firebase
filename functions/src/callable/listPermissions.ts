import * as functions from 'firebase-functions';
import * as utils from '../utils';
import { Unauthenticated } from '../utils/errors';
import { AllPermissions } from '../models/user-claims.interface';

export const listPermissionsCall = functions.https.onCall(
    async (_data: undefined, context: functions.https.CallableContext): Promise<string[]> => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error = await utils.requirePermissions(context.auth?.uid, ['accessPermissions']);
        if (error) {
            throw error;
        }

        return AllPermissions;
    }
);
