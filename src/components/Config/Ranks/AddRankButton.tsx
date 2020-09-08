import React from 'react';
import { Fab, makeStyles, Theme, createStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { AppBarProgressContext } from '../../DrawerContainer/DrawerContainer';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import PrefixDialog from './RankDialog';
import { useClaims, useFunction } from '../../../firebase';
import IRank from '../../../../functions/src/models/rank.interface';
import { IAddRankProps } from '../../../../functions/src/callable/config/ranks/addRank';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    })
);

function AddRankButton() {
    const classes = useStyles();
    const [t] = useTranslation('lang');

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const addRank = useFunction<IAddRankProps, void>('addRank');

    const handleState = (open: boolean) => () => {
        setDisabled(open);
        setIsDialogOpen(open);
    };

    const handleSave = (rank: IRank) => {
        setIsDialogOpen(false);
        setAppBarProgress('indeterminate');

        addRank({ rank })
            .then(() => enqueueSnackbar(t('rank.message.added'), { variant: 'success' }))
            .finally(() => {
                setAppBarProgress(null);
                setDisabled(false);
            });
    };

    const claims = useClaims();
    if (!claims.value?.admin && !claims.value?.permissions?.includes('manageRanks')) {
        return null;
    }
    return (
        <React.Fragment>
            <PrefixDialog
                open={isDialogOpen}
                title={t('rank.action.add')}
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

export default AddRankButton;
