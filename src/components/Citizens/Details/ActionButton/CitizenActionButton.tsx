import firebase from "firebase";
import React from 'react';
import SplitButton, { ISplitButtonOption } from '../../../form/SplitButton';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { useClaims, useCitizen, useFunction } from '../../../../firebase';
import { CircularProgress, makeStyles, Theme, createStyles } from '@material-ui/core';
import SetCitizenPhoneNumberDialog from './SetCitizenPhoneNumberDialog';
import { IRecruitCitizenProps } from '../../../../../functions/src/callable/citizen/recruitCitizen';
import { useSnackbar } from 'notistack';
import MakeCitizenRegistrationDialog from './MakeCitizenRegistrationDialog';
import {ICancelWantedProps} from "../../../../../functions/src/callable/citizen/cancelWanted";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        progressContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    })
);

interface Props {
    // Component props
}

function CitizenActionButton(props: Props) {
    const classes = useStyles();
    const [t] = useTranslation('lang');
    const { enqueueSnackbar } = useSnackbar();

    const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
    const [state, setState] = React.useState<'setPhoneNumber' | 'makeRegistration' | 'none'>(
        'none'
    );

    const recruitCitizen = useFunction<IRecruitCitizenProps, void>('recruitCitizen');
    const cancelWanted = useFunction<ICancelWantedProps, void>('cancelWanted');

    const { citizenId } = useParams() as any;
    const history = useHistory();

    const claims = useClaims();
    const citizen = useCitizen(citizenId);

    const handleClose = () => {
        setState('none');
    };

    const handleFinish = () => {
        setIsInProgress(false);
    };

    const options = React.useMemo(
        (): ISplitButtonOption[] => [
            {
                label: t('Aresztuj | Faktura'),
                show:
                    claims.value?.admin ||
                    claims.value?.permissions?.includes('accessArrestMandate'),
                action: () => history.push(`/tablet/citizen/${citizenId}/arrest-mandate`),
            },
            {
                label: t('Nr. telefonu'),
                show:
                    claims.value?.admin ||
                    claims.value?.permissions?.includes('setCitizenPhoneNumber'),
                action: () => {
                    setIsInProgress(true);
                    setState('setPhoneNumber');
                },
            },
            {
                label: t('Zatrudnij'),
                show:
                    (claims.value?.admin ||
                        claims.value?.permissions?.includes('recruitOfficer')) &&
                    !citizen.value?.IsOfficer,
                action: () => {
                    setIsInProgress(true);

                    recruitCitizen({ citizenId })
                        .then(() => enqueueSnackbar(t('Zatrudniono!'), { variant: 'success' }))
                        .finally(handleFinish);
                },
            },
            {
                label: t('Anuluj poszukiwania'),
                show:
                    (claims.value?.admin ||
                        claims.value?.permissions?.includes('cancelWanted')) &&
                    citizen.value?.IsWanted,
                action: () => {
                    setIsInProgress(true);

                    cancelWanted({ citizenId })
                        .then(() => enqueueSnackbar('Anulowano poszukiwania!', { variant: 'success' }))
                        .finally(handleFinish);
                },
            },
            {
                label: t('Wpis w kartotece'),
                show:
                    claims.value?.admin ||
                    claims.value?.permissions?.includes('makeCitizenRegistration'),
                action: () => {
                    setIsInProgress(true);
                    setState('makeRegistration');
                },
            },
        ],
        [citizen.value, claims.value, t, citizenId, history, recruitCitizen, enqueueSnackbar]
    );

    const analyticsHandler = React.useCallback((option: ISplitButtonOption) => {
        firebase.analytics().logEvent('citizen_details_action', {
            citizenId,
            option: option.label,
        });
    }, [citizenId]);

    return (
        <React.Fragment>
            {citizen.isLoading || claims.isLoading || isInProgress ? (
                <div className={classes.progressContainer}>
                    <CircularProgress color='secondary' />
                </div>
            ) : (
                <SplitButton options={options.filter((o) => o.show)} onClick={analyticsHandler} />
            )}

            <SetCitizenPhoneNumberDialog
                open={state === 'setPhoneNumber'}
                onClose={handleClose}
                onFinish={handleFinish}
            />

            <MakeCitizenRegistrationDialog
                open={state === 'makeRegistration'}
                onClose={handleClose}
                onFinish={handleFinish}
            />
        </React.Fragment>
    );
}

export default CitizenActionButton;
