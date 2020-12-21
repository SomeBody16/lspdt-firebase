import * as functions from 'firebase-functions';
import IRank from '../models/rank.interface';
import IOfficer from '../models/officer.interface';
import { AllPermissions } from '../models/user-claims.interface';

export const Unauthenticated = () =>
    new functions.https.HttpsError('unauthenticated', 'Nieautoryzowany dostęp');

export const PermissionDenied = (permission: typeof AllPermissions[number]) =>
    new functions.https.HttpsError('permission-denied', 'Brak permisji: {{permission}}', {
        permission,
    });

export const InvalidArgument = (details: any) =>
    new functions.https.HttpsError('invalid-argument', 'Nieprawidłowy argument funkcji', details);

export const CitizenNotFound = (citizenId: string) =>
    new functions.https.HttpsError('not-found', 'Nieznaleziono obywatela o id {{citizenId}}', {
        citizenId,
    });

export const RegistrationNotFound = (registrationId: string) =>
    new functions.https.HttpsError('not-found', 'Nieznaleziono wpisu w rejestrze o id {{citizenId}}', {
        registrationId,
    });

export const OfficerNotFound = (officerId: string) =>
    new functions.https.HttpsError(
        'not-found',
        'Nieznaleziono funkcjonariusza o id {{officerId}}',
        { officerId }
    );

export const PrefixNotFound = (prefixId: string) =>
    new functions.https.HttpsError('not-found', 'Nieznaleziono ikony o id {{prefixId}}', {
        prefixId,
    });

// export const OfficerExistsForCitizen = (citizenId: string) =>
//     new functions.https.HttpsError('already-exists', 'server.error.officerExistsForCitizen', {
//         citizenId,
//     });

export const RankNotFound = (rankId: string) =>
    new functions.https.HttpsError('not-found', 'Nieznaleziono rangi o id {{rankId}}', { rankId });

export const CrimeNotFound = (crimeId: string) =>
    new functions.https.HttpsError('not-found', 'Nieznaleziono przestępstwa o id {{crimeId}}', {
        crimeId,
    });

export const OfficerWithThisRankExists = (rank: IRank, officers: IOfficer[]) =>
    new functions.https.HttpsError(
        'invalid-argument',
        'Zmień rangę oficera {{officer}} aby usunąć {{rank}}',
        {
            rank: rank.Name,
            officer: officers[0].BadgeNumber,
        }
    );
