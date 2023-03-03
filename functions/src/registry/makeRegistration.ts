import { MessageBuilder, Webhook } from 'discord-webhook-node';
import * as admin from 'firebase-admin';
import ICitizen from '../models/citizen.interface';
import ICrime from '../models/crime.interface';
import IOfficer from '../models/officer.interface';
import IPrefix from '../models/prefix.interface';

export interface IRegistrationProps {
  Server: string;
  Title: string;
  Description?: string;
  Prefixes: IPrefix[];
  Citizen: ICitizen;
  OfficerAuthor: IOfficer;

  ImageUrl?: string;
  Crimes?: ICrime[];
}

type Channel = 'accounts' | 'punishments' | 'registry' | 'wanted' | 'log';

export interface IDiscordLogOptions {
  Server?: string;
  channel: Channel;
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
          .addField('Obywatel', `${props.Citizen.Name} ${props.Citizen.Surname} | ${props.Citizen.Id}`)
          .setAuthor(
            `${props.OfficerAuthor.BadgeNumber} | ${props.OfficerAuthor.Citizen.Name} ${props.OfficerAuthor.Citizen.Surname} | ${props.OfficerAuthor.Id}`
          );
        return options.customMessage ? options.customMessage(res) : res;
      },
    });

  if (Array.isArray(discordLogOptions)) {
    for (const options of discordLogOptions) {
      await sendMessage({ ...options, Server: options.Server || props.Server });
    }
  } else if (typeof discordLogOptions === 'object') {
    await sendMessage({
      ...discordLogOptions,
      Server: discordLogOptions.Server || props.Server,
    });
  }
};

export const makeDiscordLog = async (discordLogOptions: IDiscordLogOptions) => {
  const webhooksDoc = await admin
    .firestore()
    .collection('server')
    .doc(discordLogOptions.Server || 'dev')
    .get();
  const channelWebhookUrls: string[] = webhooksDoc.get(`Webhook.${discordLogOptions.channel}`) || [];
  if (!webhooksDoc.exists || !channelWebhookUrls.length) return;

  for (const channelWebhookUrl of channelWebhookUrls) {
    const hook = new Webhook(channelWebhookUrl);
    hook.setUsername('LSPD Tablet');
    hook.setAvatar('https://t7.rbxcdn.com/0bf0b1236401f5ba95b1c72a95c7df96');

    let msg = new MessageBuilder().setTitle(discordLogOptions.title).setColor(0x085ba3);
    if (discordLogOptions.customMessage) {
      msg = discordLogOptions.customMessage(msg);
    }

    hook.send(msg).then().catch();
  }
};
