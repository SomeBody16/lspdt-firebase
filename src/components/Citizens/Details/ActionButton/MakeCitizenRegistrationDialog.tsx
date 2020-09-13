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
import { useForm, Controller, FormProvider } from 'react-hook-form';
import PrefixSelect from '../../../form/PrefixSelect';
import { useSnackbar } from 'notistack';
import { AppBarProgressContext } from '../../../DrawerContainer/DrawerContainer';
import { useParams } from 'react-router-dom';
import { useFunction, useAllPrefixes } from '../../../../firebase';
import { IMakeRegistrationProps } from '../../../../../functions/src/callable/citizen/makeCitizenRegistration';
import EmojiPrefix from '../../../Chips/EmojiPrefix';

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

interface IMakeCitizenRegistrationForm {
    title: string;
    prefixesIds: string[];
    description: string;
}

function MakeCitizenRegistrationDialog(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('lang');
    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const { citizenId } = useParams() as any;

    const allPrefixes = useAllPrefixes();
    const makeCitizenRegistration = useFunction<IMakeRegistrationProps, void>(
        'makeCitizenRegistration'
    );

    const handleClose = async () => {
        props.onClose();
        props.onFinish();
    };

    const makeRegistrationForm = useForm<IMakeCitizenRegistrationForm>();

    const onSubmit = async () => {
        await makeRegistrationForm.trigger();
        const errors = makeRegistrationForm.errors;
        const error = errors.title || errors.description;
        if (error) {
            enqueueSnackbar(t(error.message || ''), { variant: 'error' });
            makeRegistrationForm.clearErrors();
            return;
        }

        if (makeRegistrationForm.getValues('prefixesIds').length <= 0) {
            enqueueSnackbar(t('Brak ikon!'), { variant: 'error' });
            makeRegistrationForm.clearErrors();
            return;
        }

        setAppBarProgress('indeterminate');

        makeCitizenRegistration({
            citizenId: citizenId,
            ...makeRegistrationForm.getValues(),
        })
            .then(() =>
                enqueueSnackbar(t('Dodano wpis!'), {
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
            <FormProvider {...makeRegistrationForm}>
                <form
                    onSubmit={makeRegistrationForm.handleSubmit(onSubmit)}
                    className={classes.form}
                    autoComplete='off'
                    noValidate
                >
                    <DialogTitle>{t('Dodaj wpis do rejestru')}</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <Controller
                            className={classes.formField}
                            as={<TextField label={t('Tytuł')} fullWidth />}
                            name='title'
                            control={makeRegistrationForm.control}
                            defaultValue=''
                            rules={{
                                required: t('Podaj tytuł!') as string,
                            }}
                        />
                        <Controller
                            className={classes.formField}
                            as={
                                <PrefixSelect
                                    fullWidth
                                    SelectProps={{
                                        multiple: true,
                                        ref: makeRegistrationForm.register,
                                        renderValue: (selected: any) =>
                                            allPrefixes.value
                                                .filter((p) => selected.includes(p.Id))
                                                .map((p) => <EmojiPrefix prefix={p} />),
                                    }}
                                />
                            }
                            name='prefixesIds'
                            control={makeRegistrationForm.control}
                            defaultValue={[]}
                        />
                        <Controller
                            className={classes.formField}
                            as={<TextField label={t('Opis')} fullWidth multiline rows={3} />}
                            name='description'
                            control={makeRegistrationForm.control}
                            defaultValue=''
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

export default MakeCitizenRegistrationDialog;
