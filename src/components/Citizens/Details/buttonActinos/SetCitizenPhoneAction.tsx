import React from 'react';
import {
    DialogTitle,
    TextField,
    DialogContent,
    DialogActions,
    Button,
    makeStyles,
    Theme,
    createStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import useSubmitButton from '../../../form/useSubmitButton';
import { useSnackbar } from 'notistack';
import { AppBarProgressContext } from '../../../DrawerContainer/DrawerContainer';
import { useParams, useHistory } from 'react-router-dom';
import { useCitizen, useFunction } from '../../../../firebase';
import { ISetCitizenPhoneNumberProps } from '../../../../../functions/src/callable/citizen/setCitizenPhoneNumber';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            width: '400px',
        },
        phoneField: {
            textAlign: 'center',
        },
    })
);

interface Props {}

interface ISetPhoneNumberForm {
    phoneNumber: string;
}

function SetCitizenPhoneAction(props: Props) {
    const [t] = useTranslation('common');
    const snackbar = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);
    const classes = useStyles();

    const { citizenId } = useParams() as any;
    const history = useHistory();

    const handleClose = () => {
        history.goBack();
    };

    const { control, handleSubmit, errors, setValue } = useForm<ISetPhoneNumberForm>();
    const [SubmitButton, setSubmitLoading] = useSubmitButton();

    const citizen = useCitizen(citizenId);
    React.useEffect(() => {
        setValue('phoneNumber', citizen.value?.PhoneNumber);
    }, [citizen, setValue]);

    const setCitizenPhoneNumber = useFunction<ISetCitizenPhoneNumberProps, void>(
        'setCitizenPhoneNumber'
    );

    const onSubmit = async (data: ISetPhoneNumberForm) => {
        setSubmitLoading(true);
        setAppBarProgress('indeterminate');

        setCitizenPhoneNumber({
            citizenId: citizenId,
            ...data,
        })
            .then(() => {
                snackbar.enqueueSnackbar(t('snackbar.phoneChangeSuccess'), {
                    variant: 'success',
                });
            })
            .catch((err) => {
                snackbar.enqueueSnackbar(t(err.message, err.details), {
                    variant: 'error',
                });
            })
            .finally(() => setAppBarProgress(null));

        handleClose();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <DialogTitle>{t('citizen.form.setPhoneDialog.title')}</DialogTitle>
            <DialogContent>
                <Controller
                    // className={classes.formField}
                    as={
                        <TextField
                            placeholder={t('citizen.example.phoneNumber')}
                            label={t('citizen.details.phoneNumber')}
                            fullWidth
                            error={(errors.phoneNumber?.message as unknown) as boolean}
                            helperText={errors.phoneNumber?.message}
                            className={classes.phoneField}
                        />
                    }
                    name='phoneNumber'
                    control={control}
                    defaultValue=''
                    rules={{
                        required: t('citizen.form.error.phoneNumberEmpty') as string,
                        pattern: {
                            value: /^[0-9]{3}-[0-9]{4}$/,
                            message: t('citizen.form.error.phoneNumberInvalid'),
                        },
                        validate: (value: string) =>
                            value !== citizen.value?.PhoneNumber ||
                            (t('citizen.form.error.phoneNumberSame') as string),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>
                    {t('common.form.cancel')}
                </Button>
                <SubmitButton>{t('common.form.save')}</SubmitButton>
            </DialogActions>
        </form>
    );
}

export default SetCitizenPhoneAction;
