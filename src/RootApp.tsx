import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, Theme, createStyles, ThemeProvider } from '@material-ui/core/styles';

import theme from './constants/theme';
import LoginScreen from './screens/LoginScreen';
import DrawerContainer from './components/DrawerContainer/DrawerContainer';
import { useAuthChanged } from './firebase';
import { SnackbarProvider } from 'notistack';
import ProvideProviders, { IProviderWithProps } from './components/utils/ProvideProviders';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100vh',
        },
    })
);

function RootApp() {
    const classes = useStyles();

    const user = useAuthChanged();

    const providers: IProviderWithProps[] = [
        {
            Provider: SnackbarProvider,
            Props: {
                maxSnack: 4,
            },
        },
        {
            Provider: ThemeProvider,
            Props: { theme },
        },
    ];

    return (
        <Router>
            <ProvideProviders providers={providers}>
                <CssBaseline />
                <div className={classes.root}>
                    <Switch>
                        <Route exact path='/'>
                            <LoginScreen />
                        </Route>
                        {/* TODO: Change 'true' to 'user' | DEBUG */}
                        <Route path='/tablet'>
                            {true ? <DrawerContainer /> : <Redirect to='/' />}
                        </Route>
                    </Switch>
                </div>
            </ProvideProviders>
        </Router>
    );
}

export default RootApp;
