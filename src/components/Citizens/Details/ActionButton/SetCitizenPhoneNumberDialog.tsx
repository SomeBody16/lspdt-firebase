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
    Dialog,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { AppBarProgressContext } from '../../../DrawerContainer/DrawerContainer';
import { useParams } from 'react-router-dom';
import { useCitizen, useFunction } from '../../../../firebase';
import { ISetCitizenPhoneNumberProps } from '../../../../../functions/src/callable/citizen/setCitizenPhoneNumber';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            width: '200px',
        },
        phoneField: {
            textAlign: 'center',
        },
    })
);

interface Props {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
}

interface ISetPhoneNumberForm {
    phoneNumber: string;
}

function SetCitizenPhoneNumberDialog(props: Props) {
    const [t] = useTranslation('lang');
    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);
    const classes = useStyles();

    const { citizenId } = useParams() as any;

    const { control, errors, setValue, clearErrors, trigger, getValues } = useForm<
        ISetPhoneNumberForm
    >();

    const citizen = useCitizen(citizenId);
    React.useEffect(() => {
        setValue('phoneNumber', citizen.value?.PhoneNumber);
    }, [citizen.value, setValue, props.open]);

    const setCitizenPhoneNumber = useFunction<ISetCitizenPhoneNumberProps, void>(
        'setCitizenPhoneNumber'
    );

    const handleClose = () => {
        props.onClose();
        props.onFinish();
    };

    const onSubmit = async () => {
        await trigger();
        if (errors && errors.phoneNumber && errors.phoneNumber.message) {
            enqueueSnackbar(t(errors.phoneNumber.message), { variant: 'error' });
            clearErrors();
            return;
        }

        setAppBarProgress('indeterminate');
        setCitizenPhoneNumber({
            citizenId: citizenId,
            ...getValues(),
        })
            .then(() => enqueueSnackbar(t('citizen.success.phoneChanged'), { variant: 'success' }))
            .finally(() => {
                setAppBarProgress(null);
                props.onFinish();
            });

        props.onClose();
    };

    return (
        <Dialog onClose={handleClose} open={props.open}>
            <form className={classes.form} autoComplete='off' noValidate>
                <DialogTitle>{t('citizen.action.setPhoneNumber')}</DialogTitle>
                <DialogContent>
                    <Controller
                        // className={classes.formField}
                        as={
                            <TextField
                                placeholder={t('citizen.example.phoneNumber')}
                                label={t('citizen.phoneNumber')}
                                fullWidth
                                inputProps={{
                                    className: classes.phoneField,
                                }}
                                autoFocus
                            />
                        }
                        name='phoneNumber'
                        control={control}
                        defaultValue={citizen.value?.PhoneNumber || ''}
                        rules={{
                            required: t('citizen.error.phoneNumberEmpty') as string,
                            pattern: {
                                value: /^[0-9]{3}-[0-9]{4}$/,
                                message: t('citizen.error.phoneNumberInvalid'),
                            },
                            validate: (value: string) =>
                                value !== citizen.value?.PhoneNumber ||
                                (t('citizen.error.phoneNumberSame') as string),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>
                        {t('common.form.button.cancel')}
                    </Button>
                    <Button onClick={onSubmit}>{t('common.form.button.save')}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default SetCitizenPhoneNumberDialog;
