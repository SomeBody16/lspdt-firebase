import React from 'react';
import { useSubmitButton } from '../form';
import { useTranslation } from 'react-i18next';
import {
    ButtonProps,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useOfficer, useClaims, useFunction } from '../../firebase';
import { IUpdateOfficerBadgeNumberProps } from '../../../functions/src/callable/officer/updateOfficerBadgeNumber';

interface Props {
    officerId: string;
    ButtonProps?: ButtonProps;
}

function ButtonChangeBadgeNumber(props: Props) {
    const [t] = useTranslation('lang');
    const { enqueueSnackbar } = useSnackbar();

    const updateOfficerBadgeNumber = useFunction<IUpdateOfficerBadgeNumberProps, void>(
        'updateOfficerBadgeNumber'
    );
    const officer = useOfficer(props.officerId);
    const [badgeNumber, setBadgeNumber] = React.useState<string>(officer.value?.BadgeNumber || '');
    React.useEffect(() => {
        if (!officer.value) return;
        setBadgeNumber(officer.value.BadgeNumber);
    }, [officer.value]);

    const [open, setOpen] = React.useState<boolean>(false);
    const [SubmitButton, setSubmitLoading] = useSubmitButton();

    const handleState = (open: boolean) => () => {
        setSubmitLoading(open);
        setOpen(open);
    };
    const handleSubmit = () => {
        if (officer.value?.BadgeNumber === badgeNumber) {
            enqueueSnackbar(t('Numer nie różni się od poprzedniego!'), {
                variant: 'error',
            });
            return;
        }
        if (badgeNumber.length <= 0) {
            enqueueSnackbar(t('Wpisz numer odznaki!'), {
                variant: 'error',
            });
            return;
        }

        setOpen(false);
        updateOfficerBadgeNumber({
            officerId: officer.value?.Id || '',
            badgeNumber,
        })
            .then(() => {
                enqueueSnackbar(t('Zmieniono numer odznaki!'), {
                    variant: 'success',
                });
            })
            .finally(() => setSubmitLoading(false));
    };

    const claims = useClaims();
    if (!claims.value?.admin && !claims.value?.permissions?.includes('changeOfficerBadgeNumber')) {
        return null;
    }
    return (
        <React.Fragment>
            <SubmitButton {...props.ButtonProps} onClick={handleState(true)}>
                {t('Nr. odznaki')}
            </SubmitButton>
            <Dialog open={open} onClose={handleState(false)}>
                <DialogTitle>{t('Zmień numer odznaki')}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin='dense'
                        label={t('Numer odznaki')}
                        fullWidth
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={handleState(false)}>
                        {t('Anuluj')}
                    </Button>
                    <Button color='primary' onClick={handleSubmit}>
                        {t('Zapisz')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default ButtonChangeBadgeNumber;
