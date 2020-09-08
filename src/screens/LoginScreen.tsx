import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, TextField } from '@material-ui/core';
import firebase from 'firebase';
import { useSubmitButton } from '../components/form';
import { useHistory } from 'react-router-dom';
import { validate } from 'validate.js';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
        },
        lspdLogo: {
            width: '30%',
        },
        form: {
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        formField: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        loginButton: {
            width: '20%',
        },
        alert: {
            marginBottom: theme.spacing(3),
        },
    })
);

interface ILoginForm {
    email: string;
    password: string;
}

function LoginScreen() {
    const classes = useStyles();
    const [t] = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();

    const history = useHistory();

    const { control, handleSubmit, errors, setValue, setError, clearErrors } = useForm<
        ILoginForm
    >();
    const [SubmitButton, setSubmitLoading] = useSubmitButton();

    const loginSuccess = () => {
        history.replace('/tablet');
    };

    const onSubmit = async (data: ILoginForm) => {
        setSubmitLoading(true);

        const currentUser = firebase.auth().currentUser;
        if (currentUser && currentUser.email === data.email) {
            await currentUser.getIdToken(true);
            return loginSuccess();
        }

        const user = await firebase
            .auth()
            .signInWithEmailAndPassword(data.email, data.password)
            .catch((err) => {
                setError('email', {
                    type: 'validate',
                    message: `login.error.${err.code}`,
                });
            });

        setSubmitLoading(false);
        if (user) {
            loginSuccess();
        }
    };

    React.useEffect(() => {
        return firebase.auth().onAuthStateChanged((user) => {
            if (user && user.email) {
                setValue('email', user.email);
                setValue('password', user.uid);
            }
        });
    }, [setValue]);

    const error = errors.email || errors.password;
    React.useEffect(() => {
        if (!error || !error.message) return;
        enqueueSnackbar(t(error.message), { variant: 'error' });
        clearErrors();
    }, [clearErrors, enqueueSnackbar, error, t]);

    return (
        <Container className={classes.root}>
            <img src='/images/lspd_logo.png' alt='LSPD Logo' className={classes?.lspdLogo} />
            <form
                noValidate
                autoComplete='off'
                className={classes.form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    className={classes.formField}
                    as={
                        <TextField
                            label={t('login.form.email')}
                            variant='filled'
                            type='email'
                            required
                        />
                    }
                    name='email'
                    control={control}
                    defaultValue=''
                    rules={{
                        required: t('login.error.emailEmpty') as string,
                        validate: (value: string) => {
                            const res = validate(
                                { value },
                                {
                                    value: {
                                        email: { message: `^${t('login.error.emailInvalid')}` },
                                    },
                                }
                            );
                            return res && res['value'] ? res['value'][0] : true;
                        },
                    }}
                />
                <Controller
                    className={classes.formField}
                    as={
                        <TextField
                            label={t('login.form.password')}
                            variant='filled'
                            type='password'
                            required
                        />
                    }
                    name='password'
                    control={control}
                    defaultValue=''
                    rules={{
                        required: t('login.error.passwordEmpty') as string,
                    }}
                />

                <SubmitButton className={classes.loginButton}>{t('Login')}</SubmitButton>
            </form>
        </Container>
    );
}

LoginScreen.propTypes = {
    // Component jsx properties
};

export default LoginScreen;
