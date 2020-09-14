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
        const [result] = await visionClient.documentTextDetection(
            `gs://lspdt-fivem-prod.appspot.com/${data.filePath}`
        );

        const fullText = result.fullTextAnnotation?.text || '';

        const [signedUrl] = await admin
            .storage()
            .bucket('lspdt-fivem-prod.appspot.com')
            .file(data.filePath)
            .getSignedUrl({
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60 * 24 * 5,
            });

        await makeDiscordLog({
            Server,
            channel: 'log',
            title: 'Zeskanowano zdjęcie',
            customMessage: (msg) =>
                msg
                    .setAuthor(context.auth?.uid || 'UNKNOWN USER ID')
                    .setImage(signedUrl || '')
                    .setDescription(`\`\`\`\n${fullText}\n\`\`\``),
        });

        return fullText;
    }
);
