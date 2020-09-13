import { Webhook, MessageBuilder } from 'discord-webhook-node';
import * as admin from 'firebase-admin';
import IPrefix from '../models/prefix.interface';
import ICitizen from '../models/citizen.interface';
import IOfficer from '../models/officer.interface';
import ICrime from '../models/crime.interface';

export interface IRegistrationProps {
    Title: string;
    Description?: string;
    Prefixes: IPrefix[];
    Citizen: ICitizen;
    OfficerAuthor: IOfficer;

    ImageUrl?: string;
    Crimes?: ICrime[];
}

export interface IDiscordLogOptions {
    channel: 'accounts' | 'punishments' | 'registry' | 'wanted' | 'log';
    title: string;
    customMessage?: (msg: MessageBuilder) => MessageBuilder;
}

export const makeRegistration = async (
    props: IRegistrationProps,
    discordLogOptions?: IDiscordLogOptions | IDiscordLogOptions[]
) => {
    await admin
        .firestore()
        .collection('registry')
        .add({
            ...props,
            CreateTime: Date.now(),
        });

    /* ************************************************************************************************ */
    if (!discordLogOptions) return;

    const sendMessage = async (options: IDiscordLogOptions) =>
        await makeDiscordLog({
            ...options,
            customMessage: (message) => {
                const res = message
                    .setTitle(props.Prefixes.map((p) => p.Content).join('') + ' ' + options.title)
                    .setDescription(props.Description || '')
                    .addField(
                        'Obywatel',
                        `${props.Citizen.Name} ${props.Citizen.Surname} | ${props.Citizen.Id}`
                    )
                    .setAuthor(
                        `${props.OfficerAuthor.BadgeNumber} | ${props.OfficerAuthor.Citizen.Name} ${props.OfficerAuthor.Citizen.Surname} | ${props.OfficerAuthor.Id}`
                    );
                return options.customMessage ? options.customMessage(res) : res;
            },
        });

    if (Array.isArray(discordLogOptions)) {
        for (const options of discordLogOptions) {
            await sendMessage(options);
        }
    } else if (typeof discordLogOptions === 'object') {
        await sendMessage(discordLogOptions);
    }
};

export const makeDiscordLog = async (discordLogOptions: IDiscordLogOptions) => {
    let channelWebhookUrl =
        'https://discordapp.com/api/webhooks/754808609656799313/UQu4bnqmKkAOt5SrkHyJczZC_jNvGLBw1qMI-sPqiW3s3X3GH6rfLTwgzbAxt5gDaWuP';
    if (discordLogOptions.channel !== 'log') {
        const webhooksDoc = await admin.firestore().collection('config').doc('webhooks').get();
        channelWebhookUrl = webhooksDoc.get(discordLogOptions.channel);
        if (!webhooksDoc.exists || !channelWebhookUrl) return;
    }

    const hook = new Webhook(channelWebhookUrl);
    hook.setUsername(
        discordLogOptions.channel === 'log'
            ? process.env.GCLOUD_PROJECT || 'PROJECT'
            : 'LSPD Tablet'
    );
    hook.setAvatar('https://t7.rbxcdn.com/0bf0b1236401f5ba95b1c72a95c7df96');

    let msg = new MessageBuilder().setTitle(discordLogOptions.title).setColor(0x085ba3);
    if (discordLogOptions.customMessage) {
        msg = discordLogOptions.customMessage(msg);
    }

    hook.send(msg).then().catch();
};
