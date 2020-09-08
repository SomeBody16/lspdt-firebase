import React from 'react';

export type FUnsubscribe = () => void;

export type FArrest = (citizenUid: number, judgment: number, reason: string) => void;
export type FMandate = (citizenUid: number, penalty: number, reason: string) => void;

export type FOnPasteImage = (src: string) => void;
export type FOnClosestId = (id: number) => void;

export interface IFivemBridge {
    arrest: FArrest;
    mandate: FMandate;
    onPasteImage: (callback: FOnPasteImage) => FUnsubscribe;
    onClosestId: (callback: FOnClosestId) => FUnsubscribe;
    requestClosestId: () => void;
}

function useFivemBridge(): IFivemBridge {
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

    const arrest = React.useCallback((citizenUid: number, judgment: number, reason: string) => {
        window.top.postMessage(
            {
                action: 'arrest',
                citizenUid,
                judgment,
                reason,
            },
            '*'
        );
    }, []);

    const mandate = React.useCallback((citizenUid: number, penalty: number, reason: string) => {
        window.top.postMessage(
            {
                action: 'arrest',
                citizenUid,
                penalty,
                reason,
            },
            '*'
        );
    }, []);

    const onPasteImage = React.useCallback(
        (callback: FOnPasteImage): FUnsubscribe => addListener('pasteImage', callback),
        [addListener]
    );

    const onClosestId = React.useCallback(
        (callback: FOnClosestId): FUnsubscribe => addListener('closestId', callback),
        [addListener]
    );

    return React.useMemo(
        () => ({
            arrest,
            mandate,
            onPasteImage,
            onClosestId,
            requestClosestId: () => window.top.postMessage({ action: 'requestClosestId' }, '*'),
        }),
        [arrest, mandate, onPasteImage, onClosestId]
    );
}

export default useFivemBridge;
