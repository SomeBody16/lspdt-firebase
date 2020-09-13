import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as vision from '@google-cloud/vision';
import * as admin from 'firebase-admin';
import { Unauthenticated } from '../../utils/errors';
import { makeDiscordLog } from '../../registry/makeRegistration';

export interface IFindByIdScanProps {
    filePath: string;
}

export const findByIdScanCall = functions.https.onCall(
    async (data: IFindByIdScanProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

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
        const [result] = await visionClient.documentTextDetection(
            `gs://citizens-ids/${data.filePath}`
        );

        const fullText = result.fullTextAnnotation?.text || '';

        const [signedUrl] = await admin
            .storage()
            .bucket('citizens-ids')
            .file(data.filePath)
            .getSignedUrl({
                action: 'read',
                expires: Date.now() + 1000 * 60,
            });

        await makeDiscordLog({
            channel: 'log',
            title: 'Zeskanowano zdjęcie',
            customMessage: (msg) =>
                msg
                    .setAuthor(context.auth?.uid || 'UNKNOWN USER ID')
                    .setImage(signedUrl || '')
                    .addField('Serwer', process.env.GCLOUD_PROJECT || 'BLANK')
                    .setDescription(`\`\`\`\n${fullText}\n\`\`\``),
        });

        return fullText;
    }
);
