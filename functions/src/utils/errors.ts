import * as functions from 'firebase-functions';
import IRank from '../models/rank.interface';
import IOfficer from '../models/officer.interface';

export const Unauthenticated = () =>
    new functions.https.HttpsError('unauthenticated', 'server.error.unauthenticated');

export const PermissionDenied = (permission: string) =>
    new functions.https.HttpsError('permission-denied', 'server.error.permissionDenied', {
        permission,
    });

export const InvalidArgument = (details: any) =>
    new functions.https.HttpsError('invalid-argument', 'server.error.invalidArgument', details);

export const CitizenNotFound = (citizenId: string) =>
    new functions.https.HttpsError('not-found', 'server.error.citizenNotFound', { citizenId });

export const OfficerNotFound = (officerId: string) =>
    new functions.https.HttpsError('not-found', 'server.error.officerNotFound', { officerId });

export const PrefixNotFound = (prefixId: string) =>
    new functions.https.HttpsError('not-found', 'server.error.prefixNotFound', { prefixId });

// export const OfficerExistsForCitizen = (citizenId: string) =>
//     new functions.https.HttpsError('already-exists', 'server.error.officerExistsForCitizen', {
//         citizenId,
//     });

export const RankNotFound = (rankId: string) =>
    new functions.https.HttpsError('not-found', 'server.error.rankNotFound', { rankId });

export const CrimeNotFound = (crimeId: string) =>
    new functions.https.HttpsError('not-found', 'server.error.crimeNotFound', { rankId: crimeId });

export const OfficerWithThisRankExists = (rank: IRank, officers: IOfficer[]) =>
    new functions.https.HttpsError('invalid-argument', 'server.error.officerWithThisRankExists', {
        rank: rank.Name,
        officer: officers[0].BadgeNumber,
    });
