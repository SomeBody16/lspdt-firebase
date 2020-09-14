import { useSnackbar, ProviderContext } from 'notistack';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import firebase from 'firebase';

interface ICatchErrorProps {
    err: {
        code: string;
        message: string;
        details: any;
    };
    useTranslationResponse: UseTranslationResponse;
    snackbar: ProviderContext;
}

function catchError({ err, useTranslationResponse, snackbar }: ICatchErrorProps) {
    const [t] = useTranslationResponse;
    console.error({ code: err.code, message: err.message, details: err.details });
    snackbar.enqueueSnackbar(t(err.message, err.details), { variant: 'error' });
}

export function useFunctionHook<T = any, R = boolean>(
    name: string
): (props?: T) => Promise<R | void> {
    const useTranslationResponse = useTranslation('lang');
    const snackbar = useSnackbar();

    return async (props?: T): Promise<R | void> => {
        const call = firebase.functions().httpsCallable(name);
        const res = await call(props).catch((err) =>
            catchError({ err, useTranslationResponse, snackbar })
        );
        if (res) {
            return res.data as R;
        } else {
            // eslint-disable-next-line no-throw-literal
            throw 'Firebase function not returned positive value';
        }
    };
}
