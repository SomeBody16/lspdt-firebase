import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, Theme, createStyles, ThemeProvider } from '@material-ui/core/styles';

import theme from './constants/theme';
import LoginScreen from './screens/LoginScreen';
import DrawerContainer from './components/DrawerContainer/DrawerContainer';
import { useAuthChanged } from './firebase';
import { SnackbarProvider } from 'notistack';
import ProvideProviders, { IProviderWithProps } from './components/utils/ProvideProviders';

import packageJson from '../package.json';
import useServer from './firebase/hooks/useServer';

import './firebase';
import firebase from 'firebase';
import 'firebase/analytics';

function analyticsSetUserProperties() {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return;
    firebase.firestore()
        .collection('officers')
        .doc(firebase.auth().currentUser?.uid || '')
        .get()
        .then(officerDoc => {
            const params = officerDoc.get('Rank');
            firebase.analytics().setUserProperties(params);
            firebase.analytics().logEvent('login', params);
        });
}

const PageAnalytics = () => {
    const location = useLocation();
    useEffect(() => {
        firebase.analytics().logEvent('page_view', location);
    }, [location]);

    const currentUser = firebase.auth().currentUser;
    useEffect(analyticsSetUserProperties, [currentUser]);
    
    return null;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100vh',
        },
        buildNumber: {
            position: 'fixed',
            bottom: theme.spacing(0.1),
            left: theme.spacing(0.1),
            fontSize: '60%',
            zIndex: 9999,
        },
    })
);

function RootApp() {
    const classes = useStyles();

    const user = useAuthChanged();
    const Server = useServer();

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
                <PageAnalytics/>
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
                    <div className={classes.buildNumber}>
                        {packageJson.build.unique}-{Server}
                    </div>
                </div>
            </ProvideProviders>
        </Router>
    );
}

export default RootApp;
