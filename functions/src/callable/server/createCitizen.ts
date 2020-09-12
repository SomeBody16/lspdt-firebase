import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as admin from 'firebase-admin';
import ICitizen from '../../models/citizen.interface';

export interface ICreateCitizenProps {
    uid: string;
    citizen: ICitizen; // Name, Surname, BirthDate
    password: string;
}

export const createCitizenCall = functions.https.onRequest(async (req, res) => {
    const data: ICreateCitizenProps = req.body;
    const error = await utils.requireValidated(data, {
        uid: {
            presence: true,
            type: 'string',
        },
        citizen: {
            ModelCitizen: ['Name', 'Surname', 'BirthDate'],
        },
        password: {
            presence: true,
            type: 'string',
        },
    });

    if (error) {
        throw error;
    }
    /* ******************************************************************* */
    const serverDoc = await admin.firestore().collection('config').doc('server').get();

    const serverPassword = serverDoc.get('Password');
    console.log('serverPassword', serverPassword);
    console.log('data.password', data.password);
    if (!serverPassword || serverPassword !== data.password) {
        throw new functions.https.HttpsError('unauthenticated', 'Invalid server password');
    }

    await admin
        .firestore()
        .collection('citizens')
        .doc(data.uid)
        .set({
            ...data.citizen,
            CreateTime: Date.now(),
            IsOfficer: false,
            IsWanted: false,
            IsChief: false,
        });

    res.sendStatus(201);
});
