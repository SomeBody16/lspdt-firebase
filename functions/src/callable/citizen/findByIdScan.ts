import * as vision from '@google-cloud/vision';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { makeDiscordLog } from '../../registry/makeRegistration';
import * as utils from '../../utils';
import { Unauthenticated } from '../../utils/errors';

export interface IFindByIdScanProps {
  filePath: string;
}

export const findByIdScanCall = functions.https.onCall(
  async (data: IFindByIdScanProps, context: functions.https.CallableContext) => {
    if (!context.auth?.uid) {
      throw Unauthenticated();
    }

    const Server = await utils.getUserServer(context.auth.uid);
    const error =
      (await utils.requirePermissions(context.auth?.uid, ['accessCitizens'])) ||
      (await utils.requireValidated(data, {
        filePath: {
          type: 'string',
          presence: true,
        },
      }));

    if (error) {
      throw error;
    }
    /* ******************************************************************* */
    const visionClient = new vision.ImageAnnotatorClient();
    const [result] = await visionClient.documentTextDetection(`gs://lpsdt-3-0.appspot.com/${data.filePath}`);

    const fullText = result.fullTextAnnotation?.text || '';

    const [signedUrl] = await admin
      .storage()
      .bucket('lpsdt-3-0.appspot.com')
      .file(data.filePath)
      .getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 5,
      });

    makeDiscordLog({
      Server,
      channel: 'log',
      title: 'Zeskanowano zdjęcie',
      customMessage: (msg) => {
        msg.setAuthor(context.auth?.uid || 'UNKNOWN USER ID').setDescription(`\`\`\`\n${fullText}\n\`\`\``);
        if (signedUrl?.length) msg.setImage(signedUrl);
        return msg;
      },
    }).catch(console.error);

    return fullText;
  }
);
