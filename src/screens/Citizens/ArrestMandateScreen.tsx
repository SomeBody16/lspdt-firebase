import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Drawer, Divider } from '@material-ui/core';
import ArrestSummaryForm from '../../components/Citizens/ArrestMandate/ArrestSummaryForm';
import ArrestCrimesList, {
    ICrimeWithCount,
} from '../../components/Citizens/ArrestMandate/ArrestCrimesList';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            width: '100%',
            height: '100%',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
        },
    })
);

export const SelectedCrimesContext = React.createContext<
    [ICrimeWithCount[], React.Dispatch<React.SetStateAction<ICrimeWithCount[]>>]
>([[], () => null]);

function ArrestMandateScreen() {
    const classes = useStyles();
    const useCrimesWithCount = React.useState<ICrimeWithCount[]>([]);

    return (
        <SelectedCrimesContext.Provider value={useCrimesWithCount}>
            <div className={classes.root}>
                <main className={classes.content}>
                    <ArrestCrimesList />
                </main>
                <Drawer
                    className={classes.drawer}
                    variant='permanent'
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor='right'
                >
                    <div className={classes.toolbar} />
                    <Divider />
                    <ArrestSummaryForm />
                </Drawer>
            </div>
        </SelectedCrimesContext.Provider>
    );
}

export default ArrestMandateScreen;
