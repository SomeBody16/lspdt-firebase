import React from 'react';
import { useSnackbar } from 'notistack';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export type FUnsubscribe = () => void;

export type FShow = (str: string) => void;
export type FArrest = (citizenUid: number, judgment: number, reason: string) => void;
export type FMandate = (citizenUid: number, penalty: number, reason: string) => void;

export type FOnPasteImage = (src: string) => void;
export type FOnClosestId = (id: number) => void;

export type FTriggerEvent = (event: string, data: any) => void;

export interface IFivemBridge {
    show: FShow;
    arrest: FArrest;
    mandate: FMandate;
    onPasteImage: (callback: FOnPasteImage) => FUnsubscribe;
    onClosestId: (callback: FOnClosestId) => FUnsubscribe;
    requestClosestId: () => void;
    triggerEvent: FTriggerEvent;
}

function useFivemBridge(): IFivemBridge {
    const [t] = useTranslation('lang');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const showCopySnackbar = React.useCallback(
        (str: string) => {
            enqueueSnackbar(str, {
                variant: 'info',
                action: (key) => (
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(str);
                            closeSnackbar(key);
                        }}
                    >
                        {t('Kopiuj')}
                    </Button>
                ),
            });
        },
        [closeSnackbar, enqueueSnackbar, t]
    );

    const [listeners, setListeners] = React.useState<{
        [key: string]: ((props: any) => void) | undefined;
    }>({});
    const addListener = React.useCallback(
        (name: string, listener: (props: any) => void): FUnsubscribe => {
            setListeners((listeners) => {
                listeners[name] = listener;
                return listeners;
            });
            return () => {
                setListeners((listeners) => {
                    listeners[name] = undefined;
                    return listeners;
                });
            };
        },
        []
    );
    React.useEffect(() => {
        const onMessageHandler = (event: MessageEvent) => {
            if (!event.data.action) return;
            const callback = listeners[event.data.action];
            callback && callback(event.data.data);
        };
        window.addEventListener('message', onMessageHandler);
        return () => window.removeEventListener('message', onMessageHandler);
    }, [listeners]);

    React.useEffect(() => {
        const onPasteHandler = (event: ClipboardEvent) => {
            const item = event.clipboardData?.items[0];
            if (item?.type.indexOf('image') === 0) {
                const blob = item.getAsFile();
                if (!blob) return;
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    listeners['pasteImage'] && listeners['pasteImage'](reader.result);
                };
                reader.readAsDataURL(blob);
            }
        };
        document.addEventListener('paste', onPasteHandler);
        return () => document.removeEventListener('paste', onPasteHandler);
    }, [listeners]);

    const show = React.useCallback(
        (str: string) => {
            showCopySnackbar(str);
        },
        [showCopySnackbar]
    );

    const arrest = React.useCallback(
        (citizenUid: number, judgment: number, reason: string) => {
            showCopySnackbar(reason);
        },
        [showCopySnackbar]
    );

    const mandate = React.useCallback(
        (citizenUid: number, penalty: number, reason: string) => {
            showCopySnackbar(reason);
        },
        [showCopySnackbar]
    );

    const onPasteImage = React.useCallback(
        (callback: FOnPasteImage): FUnsubscribe => addListener('pasteImage', callback),
        [addListener]
    );

    const onClosestId = React.useCallback(
        (callback: FOnClosestId): FUnsubscribe => addListener('closestId', callback),
        [addListener]
    );

    const triggerEvent: FTriggerEvent = React.useCallback(
        (event, data) => {
            const listener = listeners[event];
            listener && listener(data);
        },
        [listeners]
    );

    return React.useMemo(
        () => ({
            show,
            arrest,
            mandate,
            onPasteImage,
            onClosestId,
            requestClosestId: () => window.top.postMessage({ action: 'requestClosestId' }, '*'),
            triggerEvent,
        }),
        [show, arrest, mandate, onPasteImage, onClosestId, triggerEvent]
    );
}

export default useFivemBridge;
