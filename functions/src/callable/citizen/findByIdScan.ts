import * as functions from 'firebase-functions';
import * as utils from '../../utils';
import * as vision from '@google-cloud/vision';
import { Unauthenticated } from '../../utils/errors';

export interface IFindByIdScanProps {
    filePath: string;
}

export const findByIdScanCall = functions.https.onCall(
    async (data: IFindByIdScanProps, context: functions.https.CallableContext) => {
        if (!context.auth?.uid) {
            throw Unauthenticated();
        }

        const error =
            // (await utils.requirePermissions(context.auth?.uid, ['setCitizenPhoneNumber'])) ||
            await utils.requireValidated(data, {
                filePath: {
                    type: 'string',
                    presence: true,
                },
            });

        if (error) {
            throw error;
        }
        /* ******************************************************************* */
        const visionClient = new vision.ImageAnnotatorClient();
        const [result] = await visionClient.documentTextDetection(
            `gs://citizens-ids/${data.filePath}`
        );

        const fullText = result.fullTextAnnotation?.text || '';

        return fullText;
    }
);
