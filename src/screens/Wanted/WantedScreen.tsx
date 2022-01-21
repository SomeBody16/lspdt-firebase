import React from 'react';
import {Theme, createStyles} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/styles';
import ICitizen from "../../../functions/src/models/citizen.interface";
import {useHistory} from "react-router-dom";
import {
    Grid, Paper
} from "@material-ui/core";
import {useWantedList} from "../../firebase";
import CitizenInfo from "../../components/Citizens/Details/CitizenInfo";
import CitizenPhoto from "../../components/Citizens/Details/CitizenPhoto";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // Component styles
        paper: {
            // padding: theme.spacing(2),
            color: theme.palette.text.secondary,
        },
    })
);

function CitizenItem({Id}: ICitizen) {
    const classes = useStyles();
    const history = useHistory();

    const handleClick = () => {
        history.push(`/tablet/citizen/${Id}`);
    };

    return (
        <Grid item xs={4}>
            <Paper className={classes.paper} onClick={handleClick}>
                <CitizenPhoto citizenId={Id}/>
                <CitizenInfo citizenId={Id} modeWanted/>
            </Paper>
        </Grid>
    );
}

function WantedScreen() {
    const wantedList = useWantedList();

    // return (
    //   <React.Fragment>
    //     { groupArr(wantedList.citizens, 3).map((group, index) => (
    //       <Grid container spacing={2} key={index}>
    //         { group.map(citizen => <CitizenItem {...citizen} key={citizen.Id} />) }
    //       </Grid>
    //     )) }
    //   </React.Fragment>
    // )
    return (
        <Grid container spacing={2}>
            {wantedList.citizens.map(citizen => (
                <CitizenItem {...citizen} key={citizen.Id}/>
            ))}
        </Grid>
    )
    // return (
    //   <List>
    //     <CitizenItem {...citizen} isLast={true} />
    //   </List>
    // );
}

export default WantedScreen;
