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

import packageJson from '../package.json';
import firebase from 'firebase';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100vh',
        },
        buildNumber: {
            position: 'fixed',
            bottom: theme.spacing(1),
            right: theme.spacing(1),
            fontSize: '80%',
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

    React.useEffect(() => {
        const call = firebase.functions().httpsCallable('findByIdScan');
        console.log('calling find');
        call({ filePath: 'id.png' })
            .then((data) => console.log(JSON.stringify(data)))
            .catch(console.error);
    }, []);

    return (
        <Router>
            <ProvideProviders providers={providers}>
                <CssBaseline />
                <div className={classes.root}>
                    <Switch>
                        <Route exact path='/'>
                            <LoginScreen />
                        </Route>
                        <Route path='/tablet'>
                            {user || process.env.NODE_ENV === 'development' ? (
                                <DrawerContainer />
                            ) : (
                                <Redirect to='/' />
                            )}
                        </Route>
                    </Switch>
                    <div className={classes.buildNumber}>{packageJson.build.unique}</div>
                </div>
            </ProvideProviders>
        </Router>
    );
}

export default RootApp;
