import React from 'react';
import { Fab, makeStyles, Theme, createStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import PrefixDialog from './PrefixDialog';
import { useClaims, useFunction } from '../../../firebase';
import IPrefix from '../../../../functions/src/models/prefix.interface';
import { IAddPrefixProps } from '../../../../functions/src/callable/config/prefixes/addPrefix';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    })
);

function AddPrefixButton() {
    const classes = useStyles();
    const [t] = useTranslation('lang');

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const addPrefix = useFunction<IAddPrefixProps, void>('addPrefix');

    const handleState = (open: boolean) => () => {
        setDisabled(open);
        setIsDialogOpen(open);
    };

    const handleSave = (prefix: IPrefix) => {
        setIsDialogOpen(false);
        setAppBarProgress('indeterminate');

        addPrefix({ prefix })
            .then(() => enqueueSnackbar(t('Dodano!'), { variant: 'success' }))
            .finally(() => {
                setAppBarProgress(null);
                setDisabled(false);
            });
    };

    const claims = useClaims();
    if (!claims.value?.admin && !claims.value?.permissions?.includes('managePrefixes')) {
        return null;
    }
    return (
        <React.Fragment>
            <PrefixDialog
                open={isDialogOpen}
                title={t('Dodaj ikonę')}
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

export default AddPrefixButton;
