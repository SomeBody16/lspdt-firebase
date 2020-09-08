import { emojify } from 'react-emojione';
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useClaims } from '../firebase';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import SearchCitizensScreen from '../screens/Citizens/SearchCitizensScreen';
import PoliceScreen from '../screens/Police/PoliceScreen';
import ConfigCrimesScreen from '../screens/Config/CrimesScreen';
import PrefixesScreen from '../screens/Config/PrefixesScreen';
import RanksScreen from '../screens/Config/RanksScreen';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import routerPages from './routerPages';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        routerLink: {
            color: theme.palette.text.primary,
            textDecoration: 'none',
        },
    })
);

interface DrawerItemProps {
    url: string;
    exact?: boolean;
    component: any;
    requiredPermission: string;
}

const drawerItems: DrawerItemProps[] = [
    // {
    //     url: 'summary',
    //     exact: true,
    //     component: <SummaryScreen />,
    //     requiredPermission: 'accessSummary',
    // },
    {
        url: 'citizens',
        component: <SearchCitizensScreen />,
        requiredPermission: 'accessCitizens',
    },
    // {
    //     url: 'vehicles',
    //     component: <VehiclesScreen />,
    //     requiredPermission: 'accessVehicles',
    // },
    {
        url: 'police',
        component: <PoliceScreen />,
        requiredPermission: 'accessPolice',
    },
    {
        url: 'crimes',
        component: <ConfigCrimesScreen />,
        requiredPermission: 'accessCrimes',
    },
    {
        url: 'prefixes',
        component: <PrefixesScreen />,
        requiredPermission: 'accessPrefixes',
    },
    {
        url: 'ranks',
        component: <RanksScreen />,
        requiredPermission: 'accessRanks',
    },
];

function DrawerListItem(item: DrawerItemProps) {
    const classes = useStyles();
    const { url } = useRouteMatch();
    const newUrl = `${url}/${item.url}`;
    const match = useRouteMatch({
        path: newUrl,
        exact: item.exact,
    });
    const [t] = useTranslation('common');

    const claims = useClaims();
    if (!claims.value?.admin) {
        if (
            !claims.value?.permissions ||
            (item.requiredPermission &&
                !claims.value?.permissions.includes(item.requiredPermission))
        ) {
            return null;
        }
    }
    return (
        <Link to={newUrl} className={classes.routerLink}>
            <ListItem button selected={match ? true : false}>
                <ListItemIcon>{emojify(t(`app.drawer.${item.url}.icon`))}</ListItemIcon>
                <ListItemText primary={t(`app.drawer.${item.url}.text`)} />
            </ListItem>
        </Link>
    );
}

export function DrawerItems() {
    return (
        <List>
            {drawerItems.map((item) => (
                <DrawerListItem key={item.url} {...item} />
            ))}
        </List>
    );
}

export function DrawerItemsRouter() {
    let { path } = useRouteMatch();
    return (
        <Switch>
            {drawerItems.map((item) => (
                <Route key={item.url} exact={item.exact} path={`${path}/${item.url}`}>
                    {item.component}
                </Route>
            ))}
            {routerPages.map((item) => (
                <Route key={item.url} exact={item.exact} path={`${path}/${item.url}`}>
                    {item.component}
                </Route>
            ))}
            <Route path='*'>
                <SearchCitizensScreen />
            </Route>
        </Switch>
    );
}
