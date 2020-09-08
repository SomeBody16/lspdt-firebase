import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { ButtonProps } from '@material-ui/core';
import { useSubmitButton } from '../form';
import { useTranslation } from 'react-i18next';
import { red } from '@material-ui/core/colors';
import { useClaims, useFunction } from '../../firebase';
import { useSnackbar } from 'notistack';
import { IFireOfficerProps } from '../../../functions/src/callable/officer/fireOfficer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fireButton: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
            '&:hover': {
                backgroundColor: red[700],
            },
        },
    })
);

interface Props {
    ButtonProps?: ButtonProps;
    officerId: string;
}

function ButtonFireOfficer(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();

    const fireOfficer = useFunction<IFireOfficerProps, void>('fireOfficer');

    const [SubmitButton, setSubmitLoading] = useSubmitButton();
    const handleClick = () => {
        setSubmitLoading(true);

        fireOfficer({
            officerId: props.officerId,
        })
            .then(() => {
                enqueueSnackbar(t('snackbar.officerFired'), {
                    variant: 'success',
                });
            })
            .finally(() => setSubmitLoading(false));
    };

    const claims = useClaims();
    if (!claims.value?.admin && !claims.value?.permissions?.includes('fireOfficer')) {
        return null;
    }
    return (
        <SubmitButton className={classes.fireButton} {...props.ButtonProps} onClick={handleClick}>
            {t('officer.form.fire')}
        </SubmitButton>
    );
}

export default ButtonFireOfficer;
