import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Grid, Paper } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import CitizenPhoto from '../../components/Citizens/Details/CitizenPhoto';
import CitizenInfo from '../../components/Citizens/Details/CitizenInfo';
import CitizenActionButton from '../../components/Citizens/Details/ActionButton/CitizenActionButton';
import CitizenRegistry from '../../components/Citizens/Details/CitizenRegistry';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        paper: {
            // padding: theme.spacing(2),
            color: theme.palette.text.secondary,
        },
        actionButtonContainer: {
            marginTop: theme.spacing(2),
        },
    })
);

function CitizenDetailsScreen() {
    const classes = useStyles();
    const { citizenId } = useParams() as any;

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <CitizenPhoto citizenId={citizenId} />
                        <CitizenInfo citizenId={citizenId} />
                    </Paper>
                    <div className={classes.actionButtonContainer}>
                        <CitizenActionButton />
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <Paper className={classes.paper}>
                        <CitizenRegistry citizenId={citizenId} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default CitizenDetailsScreen;
