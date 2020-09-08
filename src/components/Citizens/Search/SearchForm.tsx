import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useSubmitButton } from '../../form';
import ResetButton from '../../form/ResetButton';
import Alert from '@material-ui/lab/Alert';
import firebase from 'firebase';
import ICitizen from '../../../../functions/src/models/citizen.interface';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            padding: theme.spacing(1),
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
        },
        formField: {
            marginBottom: theme.spacing(2),
        },
        buttonsContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
        },
        alert: {
            marginTop: theme.spacing(2),
            width: '100%',
        },
    })
);

interface Props {
    setSearchResult: React.Dispatch<React.SetStateAction<ICitizen[]>>;
}

interface ISearchFormInput {
    name: string;
    surname: string;
    phoneNumber: string;
}

function SearchForm(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('common');

    const { control, handleSubmit, reset, watch, errors } = useForm<ISearchFormInput>();
    const [SubmitButton, setSubmitLoading] = useSubmitButton();

    const watchFields = watch();
    const disableNameSurname = watchFields?.phoneNumber?.length > 0;
    const disablePhoneNumber = (watchFields?.name || watchFields?.surname)?.length > 0;

    const onSubmit = async (data: ISearchFormInput) => {
        setSubmitLoading(true);

        let query = firebase.firestore().collection('citizens').limit(10);
        if (disableNameSurname) {
            query = query.where('PhoneNumber', '==', data.phoneNumber);
        } else {
            query = query.where('Name', '==', data.name).where('Surname', '==', data.surname);
        }

        const result = await query.get();
        props.setSearchResult(
            result.docs.map(
                (d) =>
                    ({
                        ...d.data(),
                        Id: d.id,
                    } as ICitizen)
            )
        );

        setSubmitLoading(false);
    };

    const validateField = (skip: boolean, errorStr: string) => {
        if (skip) return undefined;
        return (value: string) => (value.length > 0 ? true : errorStr);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
            noValidate
            autoComplete='off'
        >
            <Controller
                className={classes.formField}
                as={
                    <TextField
                        placeholder={t('citizen.example.name')}
                        label={t('citizen.details.name')}
                        disabled={disableNameSurname}
                        fullWidth
                    />
                }
                name='name'
                control={control}
                defaultValue=''
                rules={{
                    validate: validateField(disableNameSurname, t('citizen.form.error.nameEmpty')),
                }}
            />
            <Controller
                className={classes.formField}
                as={
                    <TextField
                        placeholder={t('citizen.example.surname')}
                        label={t('citizen.details.surname')}
                        disabled={disableNameSurname}
                        fullWidth
                    />
                }
                name='surname'
                control={control}
                defaultValue=''
                rules={{
                    validate: validateField(
                        disableNameSurname,
                        t('citizen.form.error.surnameEmpty')
                    ),
                }}
            />
            <Controller
                className={classes.formField}
                as={
                    <TextField
                        placeholder={t('citizen.example.phoneNumber')}
                        label={t('citizen.details.phoneNumber')}
                        disabled={disablePhoneNumber}
                        fullWidth
                    />
                }
                name='phoneNumber'
                control={control}
                defaultValue=''
                rules={{
                    validate: validateField(
                        disablePhoneNumber,
                        t('citizen.form.error.phoneNumberEmpty')
                    ),
                    pattern: {
                        value: /[0-9]{3}-[0-9]{4}/,
                        message: t('citizen.form.error.phoneNumberInvalid'),
                    },
                }}
            />
            <div className={classes.buttonsContainer}>
                <SubmitButton>{t('common.form.search')}</SubmitButton>
                <ResetButton onClick={() => reset()} />
            </div>

            {Object.keys(errors).map((key, index) => {
                const err = (key as unknown) as keyof ISearchFormInput;
                const errorStr = errors[err]?.message;
                if (!errorStr) return null;
                return (
                    <Alert key={errors[err]?.message} className={classes.alert} severity='error'>
                        {errorStr}
                    </Alert>
                );
            })}
        </form>
    );
}

export default SearchForm;
