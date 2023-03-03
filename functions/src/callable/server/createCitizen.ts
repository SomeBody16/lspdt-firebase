import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import ICitizen from '../../models/citizen.interface';
import IOfficer from '../../models/officer.interface';
import { makeRegistration } from '../../registry/makeRegistration';
import * as utils from '../../utils';
import { Unauthenticated } from '../../utils/errors';
import * as modelsUtil from '../../utils/models';

export interface ICreateCitizenProps {
  uid: string;
  citizen: Omit<ICitizen, 'Server' | 'CreateTime'>; // Name, Surname, BirthDate
}

export const createCitizenCall = functions.https.onCall(
  async (data: ICreateCitizenProps, context: functions.https.CallableContext) => {
    if (!context.auth?.uid) {
      throw Unauthenticated();
    }

    const Server = await utils.getUserServer(context.auth.uid);
    const error = await utils.requireValidated(data, {
      uid: {
        presence: true,
        type: 'string',
      },
      citizen: {
        ModelCitizen: ['Name', 'Surname', 'BirthDate'],
      },
    });

    if (error) {
      throw error;
    }
    /* ******************************************************************* */
    const citizenDocData: ICitizen = {
      ...data.citizen,
      Id: data.uid,
      CreateTime: Date.now(),
      IsOfficer: false,
      IsWanted: false,
      IsChief: false,
      Server,
    };

    const target = admin.firestore().collection('citizens');
    if (data.uid && data.uid.length > 0) {
      await target.doc(data.uid).set(citizenDocData);
    } else {
      await target.add(citizenDocData);
    }
    /* ******************************************************************* */
    const officerDoc = await modelsUtil.readOfficer(context.auth.uid);
    const idScan = admin.storage().bucket('lpsdt-3-0.appspot.com').file(data.uid);
    const [idScanExists] = await idScan.exists();
    if (idScanExists) {
      await idScan.makePublic();
    }
    const ImageUrl = `https://storage.googleapis.com/lpsdt-3-0.appspot.com/${data.uid}`;
    makeRegistration(
      {
        Server,
        Citizen: citizenDocData,
        OfficerAuthor: {
          ...(officerDoc.data() as IOfficer),
          Id: officerDoc.id,
        },
        Prefixes: [
          {
            Server,
            Id: '',
            Content: ':open_file_folder:',
            Description: 'Otwarcie kartoteki',
          },
        ],
        Title: 'Otwarcie kartoteki',
        ImageUrl,
      },
      {
        channel: 'registry',
        title: 'Otwarcie kartoteki',
        customMessage: (msg) => {
          msg.setDescription('');
          if (ImageUrl.length) msg.setImage(ImageUrl);
          return msg;
        },
      }
    ).catch(console.error);

    return 1;
  }
);
