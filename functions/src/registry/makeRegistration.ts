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
    channel: 'accounts' | 'punishments' | 'registry' | 'wanted';
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
                        'Citizen',
                        `${props.Citizen.Name} ${props.Citizen.Surname} | ${props.Citizen.Id}`
                    )
                    .setColor(0x085ba3)
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
    const webhooksDoc = await admin.firestore().collection('config').doc('webhooks').get();
    const channelWebhookUrl = webhooksDoc.get(discordLogOptions.channel);
    if (!webhooksDoc.exists || !channelWebhookUrl) return;

    const hook = new Webhook(channelWebhookUrl);
    hook.setUsername('LSPD Tablet');
    hook.setAvatar('https://t7.rbxcdn.com/0bf0b1236401f5ba95b1c72a95c7df96');

    let msg = new MessageBuilder().setColor(0x085ba3);
    if (discordLogOptions.customMessage) {
        msg = discordLogOptions.customMessage(msg);
    }

    hook.send(msg).then().catch();
};
