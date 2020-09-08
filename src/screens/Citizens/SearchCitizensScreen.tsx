import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Drawer, Divider } from '@material-ui/core';
import SearchResult from '../../components/Citizens/Search/SearchResult';
import SearchForm from '../../components/Citizens/Search/SearchForm';
import ICitizen from '../../../functions/src/models/citizen.interface';

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

function SearchCitizensScreen() {
    const classes = useStyles();

    const [searchResult, setSearchResult] = React.useState<ICitizen[]>([]);

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <SearchResult searchResult={searchResult} />
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
                <SearchForm setSearchResult={setSearchResult} />
            </Drawer>
        </div>
    );
}

export default SearchCitizensScreen;
