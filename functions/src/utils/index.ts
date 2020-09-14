import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Unauthenticated, PermissionDenied } from './errors';
import ICitizen from '../models/citizen.interface';
import { requireValidated as _requireValidated } from './validators';

export const generatePassword = (length: number) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

export const requirePermissions = async (
    userUid: string | undefined,
    permissions: string[]
): Promise<functions.https.HttpsError | undefined> => {
    if (!userUid) {
        return Unauthenticated();
    }
    const creatorUser = await admin.auth().getUser(userUid);

    if (!creatorUser.customClaims) {
        return PermissionDenied(permissions[0]);
    }
    if (creatorUser.customClaims['admin']) return;

    for (const requiredPermission of permissions) {
        if (!creatorUser.customClaims[requiredPermission]) {
            return PermissionDenied(requiredPermission);
        }
    }

    return;
};

export const getUserServer = async (userUid: string): Promise<string> => {
    const user = await admin.auth().getUser(userUid);
    const server = user.customClaims?.Server;
    if (!server) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Użytkownik nie ma przydzielonego serwera'
        );
    }
    return server;
};

export const citizenStr = (citizen: ICitizen) => {
    return `${citizen.Name} ${citizen.Surname} | ${citizen.Id}`;
};

export const citizenDocStr = (
    citizenDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): string => {
    return `${citizenDoc.get('Name')} ${citizenDoc.get('Surname')} | ${citizenDoc.id}`;
};

export const officerDocAuthorStr = (
    officerDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): string => {
    return `${officerDoc.get('BadgeNumber')} | ${officerDoc.get('Citizen.Name')} ${officerDoc.get(
        'Citizen.Surname'
    )} | ${officerDoc.id}`;
};

export const rankFromOfficerDocStr = (
    officerDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): string => {
    return `${officerDoc.get('Rank.Callsign')} | ${officerDoc.get('Rank.Name')}`;
};

export const requireValidated = _requireValidated;
