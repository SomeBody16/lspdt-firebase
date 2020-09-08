import { Webhook } from 'discord-webhook-node';

const discordLogWebhookUrl =
    'https://discordapp.com/api/webhooks/748152423712817192/a3bYDC1sNC77l7qdAV8DMbaQtVLwPvSs3eukMWidrTdCbcd-9dDetf-e0Wjj7r19rh8A';
const discordAccountsWebhookUrl =
    'https://discordapp.com/api/webhooks/748231912061009920/V1-eJOXAuYdZL-YwjASfJmRxS4P9VcmEHcYrcbyvaSzpQKj3nsb-LG3LX8gkzC7YF7j3';
const discordWantedWebhookUrl =
    'https://discordapp.com/api/webhooks/751130319528263800/emzI1Ab7qeMEk_hFwXcCpcIKDL3_68InKvmyuAh8pHcNOXVGnvxjr_ap6j8DPV3H1hBD';
const discordArrestMandateWebhookUrl =
    'https://discordapp.com/api/webhooks/751161513296789515/JPa0-N-Epco78DzxQmPOO_Mg7zvZjX_gNdBMNVXzYOnfLTCQLy_sVSVSCgeTbuzHCbRo';

function getWebhook(webhookUrl: string): Webhook {
    const hook = new Webhook(webhookUrl);
    hook.setUsername('LSPD Tablet');
    hook.setAvatar('https://t7.rbxcdn.com/0bf0b1236401f5ba95b1c72a95c7df96');
    return hook;
}

export function log(): Webhook {
    return getWebhook(discordLogWebhookUrl);
}

export function accounts(): Webhook {
    return getWebhook(discordAccountsWebhookUrl);
}

export function wanted(): Webhook {
    return getWebhook(discordWantedWebhookUrl);
}

export function arrestMandate(): Webhook {
    return getWebhook(discordArrestMandateWebhookUrl);
}
