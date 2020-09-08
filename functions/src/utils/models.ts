import * as admin from 'firebase-admin';
import { CitizenNotFound, OfficerNotFound, PrefixNotFound, CrimeNotFound } from './errors';
import ICitizen from '../models/citizen.interface';
import IOfficer from '../models/officer.interface';
import IPrefix from '../models/prefix.interface';
import IRank from '../models/rank.interface';
import ICrime from '../models/crime.interface';

export const readCitizen = async (
    citizenId: string
): Promise<FirebaseFirestore.DocumentSnapshot<ICitizen>> => {
    const doc = await admin.firestore().collection('citizens').doc(citizenId).get();

    if (!doc.exists) {
        throw CitizenNotFound(citizenId);
    }

    return doc as FirebaseFirestore.DocumentSnapshot<ICitizen>;
};

export const readOfficer = async (
    officerId: string
): Promise<FirebaseFirestore.DocumentSnapshot<IOfficer>> => {
    const doc = await admin.firestore().collection('officers').doc(officerId).get();

    if (!doc.exists) {
        throw OfficerNotFound(officerId);
    }

    return doc as FirebaseFirestore.DocumentSnapshot<IOfficer>;
};

export const readOfficerByCitizenId = async (
    citizenId: string
): Promise<FirebaseFirestore.DocumentSnapshot<IOfficer>> => {
    const query = await admin
        .firestore()
        .collection('officers')
        .where('Citizen.Id', '==', citizenId)
        .get();

    if (!query.empty) {
        throw OfficerNotFound('');
    }

    return query.docs[0] as FirebaseFirestore.DocumentSnapshot<IOfficer>;
};

export const readPrefix = async (
    prefixId: string
): Promise<FirebaseFirestore.DocumentSnapshot<IPrefix>> => {
    const doc = await admin.firestore().collection('prefixes').doc(prefixId).get();

    if (!doc.exists) {
        throw PrefixNotFound(prefixId);
    }

    return doc as FirebaseFirestore.DocumentSnapshot<IPrefix>;
};

export const readCrime = async (
    crimeId: string
): Promise<FirebaseFirestore.DocumentSnapshot<ICrime>> => {
    const doc = await admin.firestore().collection('crimes').doc(crimeId).get();

    if (!doc.exists) {
        throw CrimeNotFound(crimeId);
    }

    return doc as FirebaseFirestore.DocumentSnapshot<ICrime>;
};

export const readRank = async (
    rankId: string
): Promise<FirebaseFirestore.DocumentSnapshot<IRank>> => {
    const doc = await admin.firestore().collection('ranks').doc(rankId).get();

    if (!doc.exists && rankId === 'default') {
        await doc.ref.set({
            Callsign: 'X',
            ImageUrl:
                'https://vignette.wikia.nocookie.net/gtawiki/images/7/7f/LSPD_logo_GTA_V.png/revision/latest/top-crop/width/360/height/450?cb=20150425201508',
            Name: 'Police Chief',
        });
        return readRank(rankId);
    }

    if (!doc.exists) {
        throw PrefixNotFound(rankId);
    }

    return doc as FirebaseFirestore.DocumentSnapshot<IRank>;
};
