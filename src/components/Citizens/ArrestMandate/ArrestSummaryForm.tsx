import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useSubmitButton } from '../../form';
import {
    TextField,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    Icon,
    Button,
} from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { emojify } from 'react-emojione';
import { red } from '@material-ui/core/colors';
import useFivemBridge from '../../../hooks/useFivemBridge';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useSnackbar } from 'notistack';
import { SelectedCrimesContext } from '../../../screens/Citizens/ArrestMandateScreen';
import { useCitizen, useOfficer, useFunction } from '../../../firebase';
import { IMakeCitizenWantedProps } from '../../../../functions/src/callable/citizen/arrestMandate/makeCitizenWanted';
import { IConfirmArrestMandateProps } from '../../../../functions/src/callable/citizen/arrestMandate/confirmArrestMandate';
import { penaltyJudgmentStr } from '../../Chips/PenaltyJudgment';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            padding: theme.spacing(2),
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
        },
        formField: {
            marginBottom: theme.spacing(1),
            marginRight: 'auto',
        },
        spacer: {
            marginBottom: 'auto',
        },
        button: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        buttonWanted: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
            '&:hover': {
                backgroundColor: red[700],
            },
        },
    })
);

interface IArrestSummaryForm {
    penalty: number;
    judgment: number;
    author: string;
}

function ArrestSummaryForm() {
    const classes = useStyles();

    const fivemBridge = useFivemBridge();
    const translationResponse = useTranslation('lang');
    const [t] = translationResponse;
    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const { citizenId } = useParams() as any;
    const history = useHistory();

    const [crimesWithCount, setCrimesWithCount] = React.useContext(SelectedCrimesContext);

    const citizen = useCitizen(citizenId);
    const officerAuthor = useOfficer();
    const makeCitizenWanted = useFunction<IMakeCitizenWantedProps, void>('makeCitizenWanted');
    const confirmArrestMandate = useFunction<IConfirmArrestMandateProps, void>(
        'confirmArrestMandate'
    );

    const { control, handleSubmit, setValue, watch } = useForm<IArrestSummaryForm>();
    const [includeWanted, setIncludeWanted] = React.useState<boolean>(false);
    const formValue = watch();
    const [MakeWantedButton, setMakeWantedButtonLoading] = useSubmitButton();
    const [ConfirmButton, setConfirmButtonLoading] = useSubmitButton();

    React.useEffect(() => {
        const penalty = crimesWithCount
            .map((c) => c.Penalty * c.count)
            .reduce((prevValue, current) => prevValue + current, 0);

        const judgment = crimesWithCount
            .map((c) => c.Judgment * c.count)
            .reduce((prevValue, current) => prevValue + current, 0);

        setValue('penalty', penalty);
        setValue('judgment', judgment);
    }, [crimesWithCount, setValue]);

    React.useEffect(() => {
        setValue(
            'author',
            officerAuthor.value?.Rank.Name +
                ' | ' +
                officerAuthor.value?.Citizen.Name +
                ' ' +
                officerAuthor.value?.Citizen.Surname
        );
    }, [officerAuthor.value, setValue]);

    const reasonStr = (): string => {
        return [
            ...crimesWithCount
                .filter((c) => c.count > 0)
                .map((c) => `[${c.Name}${c.count > 0 ? ' x' + c.count : ''}]`),
            formValue.author,
        ].join(' ');
    };

    const [closestId, setClosestId] = React.useState<number>(0);
    React.useEffect(() => {
        fivemBridge.requestClosestId();
        return fivemBridge.onClosestId(setClosestId);
    }, [fivemBridge]);

    const handleShowClick = () => {
        fivemBridge.show(
            [
                ...reasonStr().split(' '),
                '\n',
                penaltyJudgmentStr(formValue, translationResponse),
            ].join(' ')
        );
    };

    const handleMandateClick = async () => {
        fivemBridge.mandate(closestId, formValue.penalty, reasonStr());
    };

    const handleArrestClick = async () => {
        fivemBridge.arrest(closestId, formValue.judgment, reasonStr());
    };

    const handleIncludeWanted = (includeWanted: boolean) => {
        setIncludeWanted(includeWanted);
        const countChangeValue = includeWanted ? 1 : -1;
        setCrimesWithCount((crimes) => {
            if (!citizen || !citizen.value?.WantedCrimesIds) {
                return crimes;
            }

            citizen.value.WantedCrimesIds.forEach((crimeId) => {
                crimes = crimes.map((crime) => ({
                    ...crime,
                    count: crime.Id === crimeId ? crime.count + countChangeValue : crime.count,
                }));
            });

            return crimes.map((crime) => ({
                ...crime,
                count: crime.count < 0 ? 0 : crime.count,
            }));
        });
    };

    const handleMakeWandedClick = () => {
        setMakeWantedButtonLoading(true);
        setAppBarProgress('indeterminate');

        const crimesIds: string[] = [];
        crimesWithCount.forEach((crime) => {
            if (crime.count > 0) {
                for (let i = 0; i < crime.count; i++) {
                    crimesIds.push(crime.Id);
                }
            }
        });

        makeCitizenWanted({
            citizenId,
            crimesIds,
            author: formValue.author,
        })
            .then(() => {
                enqueueSnackbar(t('Wystawiono list gończy!'), {
                    variant: 'success',
                });
                history.replace(`/tablet/citizen/${citizenId}`);
            })
            .finally(() => {
                setMakeWantedButtonLoading(false);
                setAppBarProgress(null);
            });
    };

    const onConfirm = async (data: IArrestSummaryForm) => {
        setConfirmButtonLoading(true);
        setAppBarProgress('indeterminate');

        const crimesIds: string[] = [];
        crimesWithCount.forEach((crime) => {
            if (crime.count > 0) {
                for (let i = 0; i < crime.count; i++) {
                    crimesIds.push(crime.Id);
                }
            }
        });

        confirmArrestMandate({
            citizenId,
            crimesIds,
            author: formValue.author,
        })
            .then(() => {
                enqueueSnackbar(t('Zapisano wpis w kartotece!'), {
                    variant: 'success',
                });
                history.replace(`/tablet/citizen/${citizenId}`);
            })
            .finally(() => {
                setConfirmButtonLoading(false);
                setAppBarProgress(null);
            });
    };

    return (
        <form onSubmit={handleSubmit(onConfirm)} className={classes.form}>
            <TextField
                className={classes.formField}
                label={t('Imię')}
                variant='filled'
                value={citizen.value?.Name || '...'}
                disabled
                fullWidth
            />
            <TextField
                className={classes.formField}
                label={t('Nazwisko')}
                variant='filled'
                value={citizen.value?.Surname || '...'}
                disabled
                fullWidth
            />
            <Controller
                className={classes.formField}
                as={
                    <TextField
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    {t('intl.number.penalty.currency')}
                                </InputAdornment>
                            ),
                        }}
                        type='number'
                        label={t('Grzywna')}
                        variant='filled'
                    />
                }
                name='penalty'
                control={control}
                defaultValue=''
            />
            <Controller
                className={classes.formField}
                as={
                    <TextField
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    {t('intl.number.judgment.unit')}
                                </InputAdornment>
                            ),
                        }}
                        type='number'
                        label={t('Odsiadka')}
                        variant='filled'
                    />
                }
                name='judgment'
                control={control}
                defaultValue=''
            />
            <Controller
                className={classes.formField}
                as={
                    <TextField
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <Icon>local_police</Icon>
                                </InputAdornment>
                            ),
                        }}
                        label={t('Autor')}
                        variant='filled'
                    />
                }
                name='author'
                control={control}
                defaultValue=''
            />
            {citizen.value?.IsWanted && (
                <FormControlLabel
                    className={classes.formField}
                    control={<Checkbox onChange={(e) => handleIncludeWanted(e.target.checked)} />}
                    label={t('Dołącz list gończy')}
                />
            )}

            <div className={classes.spacer}></div>

            {/* <Button
                className={classes.formField}
                fullWidth
                variant='outlined'
                onClick={fivemBridge.requestClosestId}
            >
                <div className={classes.button}>
                    <span>{t('fivem.closestId', { closestId })}</span>
                    <span>{emojify(':id:')}</span>
                </div>
            </Button> */}
            <Button
                className={classes.formField}
                fullWidth
                variant='outlined'
                onClick={handleShowClick}
                disabled={
                    crimesWithCount.length <= 0 ||
                    (formValue.penalty <= 0 && formValue.judgment <= 0)
                }
            >
                <div className={classes.button}>
                    <span>{t('Podsumowanie')}</span>
                    <span>{emojify(':speech_balloon:')}</span>
                </div>
            </Button>
            <Button
                className={classes.formField}
                fullWidth
                variant='contained'
                onClick={handleMandateClick}
                disabled={formValue.penalty <= 0}
            >
                <div className={classes.button}>
                    <span>{t('Faktura')}</span>
                    <span>{emojify(':dollar:')}</span>
                </div>
            </Button>
            <Button
                className={classes.formField}
                fullWidth
                variant='contained'
                color='secondary'
                onClick={handleArrestClick}
                disabled={formValue.judgment <= 0}
            >
                <div className={classes.button}>
                    <span>{t('Aresztowanie')}</span>
                    <span>{emojify(':cop:')}</span>
                </div>
            </Button>
            <MakeWantedButton
                className={`${classes.formField} ${classes.buttonWanted}`}
                onClick={handleMakeWandedClick}
                type='button'
                fullWidth
                disabled={
                    crimesWithCount.length <= 0 ||
                    (formValue.penalty <= 0 && formValue.judgment <= 0) ||
                    includeWanted
                }
            >
                <div className={classes.button}>
                    <span>{t('List gończy')}</span>
                    <span>{emojify(':spy:')}</span>
                </div>
            </MakeWantedButton>
            <ConfirmButton
                fullWidth
                disabled={
                    crimesWithCount.length <= 0 ||
                    (formValue.penalty <= 0 && formValue.judgment <= 0)
                }
            >
                <div className={classes.button}>
                    <span>{t('Potwierdź')}</span>
                    <span>{emojify(':clipboard:')}</span>
                </div>
            </ConfirmButton>
        </form>
    );
}

export default ArrestSummaryForm;
