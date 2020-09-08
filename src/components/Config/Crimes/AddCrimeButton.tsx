import React from 'react';
import { Fab, makeStyles, Theme, createStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import CrimeDialog from './CrimeDialog';
import ICrime from '../../../../functions/src/models/crime.interface';
import { useClaims, useFunction } from '../../../firebase';
import { IAddCrimeProps } from '../../../../functions/src/callable/config/crimes/addCrime';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    })
);

function AddCrimeButton() {
    const classes = useStyles();
    const [t] = useTranslation('lang');

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const addCrime = useFunction<IAddCrimeProps, void>('addCrime');

    const handleState = (open: boolean) => () => {
        setDisabled(open);
        setIsDialogOpen(open);
    };

    const handleSave = (crime: ICrime) => {
        setIsDialogOpen(false);
        setAppBarProgress('indeterminate');

        addCrime({ crime })
            .then(() => enqueueSnackbar(t('crime.message.added'), { variant: 'success' }))
            .finally(() => {
                setAppBarProgress(null);
                setDisabled(false);
            });
    };

    const claims = useClaims();
    if (!claims.value?.admin && !claims.value?.permissions?.includes('manageCrimes')) {
        return null;
    }
    return (
        <React.Fragment>
            <CrimeDialog
                open={isDialogOpen}
                title={t('crime.action.add')}
                onClose={handleState(false)}
                onSave={handleSave}
            />
            <Fab
                className={classes.fab}
                disabled={disabled}
                onClick={handleState(true)}
                color='primary'
            >
                <Add />
            </Fab>
        </React.Fragment>
    );
}

export default AddCrimeButton;
