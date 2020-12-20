import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useSubmitButton } from '../../form';
import ResetButton from '../../form/ResetButton';
import firebase from 'firebase';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import useFivemBridge from '../../../hooks/useFivemBridge';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useFunction } from '../../../firebase';
import { IFindByIdScanProps } from '../../../../functions/src/callable/citizen/findByIdScan';
import * as uuid from 'uuid';
import { IMakeSearchData } from '../../../screens/Citizens/SearchCitizensScreen';
import useServer from '../../../firebase/hooks/useServer';

const testAndExtract = (
    variant: string
): {
    test: (lines: string[]) => boolean;
    extract: (lines: string[]) => Exclude<IMakeSearchData['idContent'], undefined>;
} => {
    switch (variant) {
        default:
            return {
                test: (lines) =>
                    lines.length >= 5 &&
                    /Dowód osobisty/.test(lines[1]) &&
                    /Data urodzenia.+/.test(lines[3]) &&
                    /Wzrost.+/.test(lines[4]),
                extract: (lines) => ({
                    Name: lines[2].split(' ')[0],
                    Surname: lines[2].split(' ')[1],
                    BirthDate: lines[3].split(' : ')[1],
                    Height: lines[4].split(': ')[1],
                }),
            };
    }
};

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
            justifyContent: 'flex-end',
        },
        button: {
            marginLeft: theme.spacing(1),
        },
        alert: {
            marginTop: theme.spacing(2),
            width: '100%',
        },
    })
);

interface Props {
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    setIdScan: React.Dispatch<React.SetStateAction<HTMLImageElement | undefined>>;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    makeSearch: (data: IMakeSearchData) => void;
}

interface ISearchFormInput {
    name: string;
    surname: string;
    phoneNumber: string;
}

function SearchForm(props: Props) {
    const Server = useServer();
    const classes = useStyles();
    const [t] = useTranslation('lang');
    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const { control, handleSubmit, reset, watch, errors, clearErrors } = useForm<
        ISearchFormInput
    >();
    const [SubmitButton] = useSubmitButton();

    const watchFields = watch();
    const disableNameSurname = watchFields?.phoneNumber?.length > 0;
    const disablePhoneNumber = (watchFields?.name || watchFields?.surname)?.length > 0;

    const onSubmit = async (data: ISearchFormInput) => {
        props.setIdScan(undefined);
        const idContent: Exclude<IMakeSearchData['idContent'], undefined> = {
            Name: data.name,
            Surname: data.surname,
            BirthDate: '',
            Height: '',
        };
        disableNameSurname
            ? props.makeSearch({ phoneNumber: data.phoneNumber, idContent })
            : props.makeSearch({ name: data.name, surname: data.surname, idContent });
    };

    const validateField = (skip: boolean, errorStr: string) => {
        if (skip) return undefined;
        return (value: string) => (value.length > 0 ? true : errorStr);
    };

    const error = errors.name || errors.surname || errors.phoneNumber;
    React.useEffect(() => {
        if (!error || !error.message) return;
        enqueueSnackbar(t(error.message), { variant: 'error' });
        clearErrors();
    }, [clearErrors, enqueueSnackbar, error, t]);

    const findByIdScan = useFunction<IFindByIdScanProps, string>('findByIdScan');
    const fivemBridge = useFivemBridge();
    React.useEffect(() => {
        return fivemBridge.onPasteImage(async (src) => {
            props.setActiveStep(1);
            props.setStatus(t('Wczytywanie dokumentu'));

            const image = new Image();
            props.setIdScan(image);
            image.onerror = () => {
                enqueueSnackbar(t('W schowku nie znaleziono zdjęcia!'), {
                    variant: 'error',
                });
                props.setActiveStep(0);
            };
            image.onload = () => {
                props.setStatus(t('Skanowanie'));

                const idScanRef = firebase.storage().ref(uuid.v4() + '.png');
                const uploadTask = idScanRef.putString(src, 'data_url');

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setAppBarProgress(progress);
                    },
                    (err) => {
                        enqueueSnackbar(t(err.message), { variant: 'error' });
                        props.setActiveStep(0);
                    },
                    async () => {
                        setAppBarProgress(null);

                        const idText = (await findByIdScan({
                            filePath: uploadTask.snapshot.ref.name,
                        })) as string;
                        const lines = idText.split('\n');

                        const { test, extract } = testAndExtract(Server || 'dev');

                        if (!test(lines)) {
                            console.log({ lines, env: process.env });
                            enqueueSnackbar(t('Błąd skanowania'), { variant: 'error' });
                            props.setActiveStep(0);
                            return;
                        }

                        const idContent = extract(lines);
                        props.makeSearch({
                            uuid: uploadTask.snapshot.ref.name,
                            name: idContent.Name,
                            surname: idContent.Surname,
                            idContent,
                        });
                    }
                );
            };

            image.src = src;
        });
    }, [fivemBridge, setAppBarProgress, enqueueSnackbar, t, props, findByIdScan, Server]);

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
                        placeholder={t('Samuel')}
                        label={t('Imię')}
                        disabled={disableNameSurname}
                        fullWidth
                    />
                }
                name='name'
                control={control}
                defaultValue=''
                rules={{
                    validate: validateField(
                        disableNameSurname,
                        t('Podaj imię i nazwisko lub nr. telefonu!')
                    ),
                    pattern: {
                        value: /^[A-z]+$/,
                        message: t('Nieprawidłowe znaki!'),
                    },
                }}
            />
            <Controller
                className={classes.formField}
                as={
                    <TextField
                        placeholder={t('Buddy')}
                        label={t('Nazwisko')}
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
                        t('Podaj imię i nazwisko lub nr. telefonu!')
                    ),
                    pattern: {
                        value: /^[A-z]+$/,
                        message: t('Nieprawidłowe znaki!'),
                    },
                }}
            />
            <Controller
                className={classes.formField}
                as={
                    <TextField
                        placeholder={t('000-0000')}
                        label={t('Numer telefonu')}
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
                        t('Podaj imię i nazwisko lub nr. telefonu!')
                    ),
                    pattern: {
                        value: /^[0-9]{3}-[0-9]{4}$/,
                        message: t('Nieprawidłowy numer telefonu!'),
                    },
                }}
            />
            <div className={classes.buttonsContainer}>
                <SubmitButton className={classes.button}>{t('Wyszukaj')}</SubmitButton>
                <ResetButton className={classes.button} onClick={() => reset()} />
            </div>
        </form>
    );
}

export default SearchForm;
