import React, { Fragment } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';

export type TArrest = (citizenUid: number, judgment: number, reason: string) => Promise<void>;
export type TMandate = (citizenUid: number, penalty: number, reason: string) => Promise<void>;

export interface IFivemBridge {
    arrest: TArrest;
    mandate: TMandate;
}

function useFivemBridge(): IFivemBridge {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [t] = useTranslation('common');

    const enqueueCopySnackbar = (text: string) => {
        enqueueSnackbar(text, {
            variant: 'info',
            action: (key) => (
                <Fragment>
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(text);
                            closeSnackbar(key);
                        }}
                    >
                        {t('snackbar.copy')}
                    </Button>
                </Fragment>
            ),
        });
    };

    return {
        arrest: async (citizenUid: number, judgment: number, reason: string) => {
            enqueueCopySnackbar(reason);
        },
        mandate: async (citizenUid: number, penalty: number, reason: string) => {
            enqueueCopySnackbar(reason);
        },
    };
}

export default useFivemBridge;
