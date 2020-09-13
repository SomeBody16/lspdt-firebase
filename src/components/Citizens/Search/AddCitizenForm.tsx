import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { IMakeSearchData } from '../../../screens/Citizens/SearchCitizensScreen';
import { Formik } from 'formik';
import validate from 'validate.js';
import { Button, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useFunction } from '../../../firebase';
import { ICreateCitizenProps } from '../../../../functions/src/callable/server/createCitizen';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bottomContainer: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        formField: {
            marginBottom: theme.spacing(1),
        },
    })
);

interface Props {
    makeSearchData?: IMakeSearchData;
    idScan: HTMLImageElement | undefined;
}

function AddCitizenForm(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('lang');
    const setAppBarProgress = React.useContext(AppBarProgressContext);
    const fieldValidators = {
        presence: true,
        type: 'string',
    };

    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const createCitizen = useFunction<ICreateCitizenProps, void>('createCitizen');

    return (
        <div>
            <Typography variant='h6' align='right'>
                {t('Dodaj do bazy danych')}
            </Typography>
            <Formik
                initialValues={{
                    ...(props.makeSearchData?.idContent as Exclude<
                        IMakeSearchData['idContent'],
                        undefined
                    >),
                }}
                validate={(values) =>
                    validate(values, {
                        Name: fieldValidators,
                        Surname: fieldValidators,
                        BirthDate: fieldValidators,
                        Height: fieldValidators,
                    })
                }
                onSubmit={async (values, { setSubmitting }) => {
                    setAppBarProgress('indeterminate');

                    createCitizen({
                        citizen: {
                            ...values,
                            Id: props.makeSearchData?.uuid || '',
                            CreateTime: Date.now(),
                        },
                        uid: props.makeSearchData?.uuid || '',
                    })
                        .then(() => {
                            enqueueSnackbar(t('Założono kartoteke!'), { variant: 'success' });
                            history.push(`/tablet/citizen/${props.makeSearchData?.uuid || ''}`);
                        })
                        .finally(() => {
                            setAppBarProgress(null);
                            setSubmitting(false);
                        });
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            className={classes.formField}
                            name='Name'
                            label={t('Imię')}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Name}
                            fullWidth
                            disabled={isSubmitting}
                        />
                        <TextField
                            className={classes.formField}
                            name='Surname'
                            label={t('Nazwisko')}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Surname}
                            fullWidth
                            disabled={isSubmitting}
                        />
                        <TextField
                            className={classes.formField}
                            name='BirthDate'
                            label={t('Data urodzenia')}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.BirthDate}
                            fullWidth
                            disabled={isSubmitting}
                        />
                        <TextField
                            className={classes.formField}
                            name='Height'
                            label={t('Wzrost')}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Height}
                            fullWidth
                            disabled={isSubmitting}
                        />
                        <div className={classes.bottomContainer}>
                            {props.idScan ? <img src={props.idScan.src} alt='' /> : <span></span>}
                            <Button
                                variant='contained'
                                color='primary'
                                type='submit'
                                disabled={isSubmitting}
                            >
                                {t('Zapisz')}
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}

export default AddCitizenForm;
