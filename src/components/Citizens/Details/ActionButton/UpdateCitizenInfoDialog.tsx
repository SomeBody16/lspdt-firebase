import React, {useEffect} from 'react';
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
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { AppBarProgressContext } from '../../../DrawerContainer/DrawerContainer';
import { useParams } from 'react-router-dom';
import {useFunction, useCitizen} from '../../../../firebase';
import {IUpdateCitizenInfoProps} from "../../../../../functions/src/callable/citizen/updateCitizenInfo";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            width: '400px',
        },
        dialogContent: {
            paddingRight: theme.spacing(1),
        },
        formField: {
            marginTop: theme.spacing(1),
        },
        alert: {
            marginBottom: theme.spacing(3),
        },
    })
);

interface Props {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
}

interface IUpdateCitizenInfoForm {
    BirthDate: string,
    Height: string,
}

function UpdateCitizenInfoDialog(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('lang');
    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const updateCitizenInfo = useFunction<IUpdateCitizenInfoProps, void>(
        'updateCitizenInfo'
    );

    const handleClose = async () => {
        props.onClose();
        props.onFinish();
    };

    const updateCitizenForm = useForm<IUpdateCitizenInfoForm>();

    const { citizenId } = useParams() as any;
    const citizen = useCitizen(citizenId);

    const onSubmit = async () => {
        await updateCitizenForm.trigger();
        const errors = updateCitizenForm.errors;
        const error = errors.BirthDate || errors.Height;
        if (error) {
            enqueueSnackbar(t(error.message || ''), { variant: 'error' });
            updateCitizenForm.clearErrors();
            return;
        }

        setAppBarProgress('indeterminate');

        updateCitizenInfo({
            citizenId: citizenId,
            ...updateCitizenForm.getValues(),
        })
            .then(() =>
                enqueueSnackbar('Zaktualizowano informacje!', {
                    variant: 'success',
                })
            )
            .finally(() => {
                setAppBarProgress(null);
                props.onFinish();
            });

        props.onClose();
    };

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <FormProvider {...updateCitizenForm}>
                <form
                    onSubmit={updateCitizenForm.handleSubmit(onSubmit)}
                    className={classes.form}
                    autoComplete='off'
                    noValidate
                >
                    <DialogTitle>Dodaj wpis do rejestru</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <Controller
                            className={classes.formField}
                            as={<TextField label='Data urodzenia' fullWidth />}
                            name='BirthDate'
                            control={updateCitizenForm.control}
                            defaultValue={citizen.value?.BirthDate || ''}
                        />
                        <Controller
                            className={classes.formField}
                            as={<TextField label='Wzrost' fullWidth />}
                            name='Height'
                            control={updateCitizenForm.control}
                            defaultValue={citizen.value?.Height || ''}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='primary'>
                            {t('Anuluj')}
                        </Button>
                        <Button onClick={onSubmit}>{t('Zapisz')}</Button>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    );
}

export default UpdateCitizenInfoDialog;
