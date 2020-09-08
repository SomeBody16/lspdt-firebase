import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { AppBarProgressContext } from '../../../DrawerContainer/DrawerContainer';
import { useHistory, useParams } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useFunction } from '../../../../firebase';
import { IRecruitCitizenProps } from '../../../../../functions/src/callable/citizen/recruitCitizen';

function RecruitCitizen() {
    const [t] = useTranslation('common');
    const snackbar = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const history = useHistory();
    const { citizenId } = useParams() as any;

    const recruitCitizen = useFunction<IRecruitCitizenProps, void>('recruitCitizen');

    React.useEffect(() => {
        setAppBarProgress('indeterminate');

        if (!citizenId) return;

        recruitCitizen({ citizenId })
            .then(() => {
                snackbar.enqueueSnackbar(t('snackbar.recruitSuccess'), {
                    variant: 'success',
                });
            })
            .finally(() => setAppBarProgress(null));

        history.goBack();
    }, [citizenId, history, recruitCitizen, setAppBarProgress, snackbar, t]);

    return <CircularProgress color='secondary' />;
}

export default RecruitCitizen;
