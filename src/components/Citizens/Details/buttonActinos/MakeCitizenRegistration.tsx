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
import { useForm, Controller, FormProvider } from 'react-hook-form';
import useSubmitButton from '../../../form/useSubmitButton';
import PrefixSelect from '../../../form/PrefixSelect';
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';
import { AppBarProgressContext } from '../../../DrawerContainer/DrawerContainer';
import { useParams, useHistory } from 'react-router-dom';
import { useFunction } from '../../../../firebase';
import { IMakeRegistrationProps } from '../../../../../functions/src/callable/citizen/makeCitizenRegistration';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
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

interface IMakeCitizenRegistrationForm {
    title: string;
    prefixesIds: string[];
    description: string;
}

function MakeCitizenRegistration() {
    const classes = useStyles();
    const [t] = useTranslation('common');
    const snackbar = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const { citizenId } = useParams() as any;
    const history = useHistory();

    const makeCitizenRegistration = useFunction<IMakeRegistrationProps, void>(
        'makeCitizenRegistration'
    );

    const handleClose = async () => {
        history.goBack();
    };

    const makeRegistrationForm = useForm<IMakeCitizenRegistrationForm>();
    const [SubmitButton, setSubmitLoading] = useSubmitButton();

    const onSubmit = async (data: IMakeCitizenRegistrationForm) => {
        setSubmitLoading(true);
        setAppBarProgress('indeterminate');

        makeCitizenRegistration({
            citizenId: citizenId,
            ...data,
        })
            .then(() => {
                snackbar.enqueueSnackbar(t('snackbar.makeCitizenRegistrationSuccess'), {
                    variant: 'success',
                });
            })
            .finally(() => setAppBarProgress(null));

        handleClose();
    };

    const errors = makeRegistrationForm.errors;
    const error =
        errors.title || errors.description || (errors.prefixesIds && errors.prefixesIds[0]);

    return (
        <FormProvider {...makeRegistrationForm}>
            <form onSubmit={makeRegistrationForm.handleSubmit(onSubmit)} className={classes.root}>
                <DialogTitle>{t('citizen.form.makeRegistration.modalTitle')}</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    {error && (
                        <Alert className={classes.alert} severity='error'>
                            {error.message}
                        </Alert>
                    )}
                    <Controller
                        className={classes.formField}
                        as={
                            <TextField
                                label={t('citizen.form.makeRegistration.title')}
                                variant='filled'
                                fullWidth
                            />
                        }
                        name='title'
                        control={makeRegistrationForm.control}
                        defaultValue=''
                        rules={{
                            required: t('citizen.form.makeRegistration.error.titleEmpty') as string,
                        }}
                    />
                    <PrefixSelect className={classes.formField} name='prefixesIds' />
                    <Controller
                        className={classes.formField}
                        as={
                            <TextField
                                label={t('citizen.form.makeRegistration.description')}
                                variant='filled'
                                fullWidth
                                multiline
                                rows={3}
                            />
                        }
                        name='description'
                        control={makeRegistrationForm.control}
                        defaultValue=''
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>
                        {t('common.form.cancel')}
                    </Button>
                    <SubmitButton>{t('common.form.save')}</SubmitButton>
                </DialogActions>
            </form>
        </FormProvider>
    );
}

export default MakeCitizenRegistration;
