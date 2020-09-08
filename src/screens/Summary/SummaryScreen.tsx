import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // Component styles
    })
);

function SummaryScreen() {
    const classes = useStyles();
    return <div>SummaryScreen works!</div>;
}

export default SummaryScreen;
