import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Chip, Avatar } from '@material-ui/core';
import ICitizen from '../../../functions/src/models/citizen.interface';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chip: {
            margin: theme.spacing(0.5),
        },
    })
);

function CitizenChip(citizen: ICitizen) {
    const classes = useStyles();
    const history = useHistory();

    return (
        <Chip
            className={classes.chip}
            label={citizen.Name + ' ' + citizen.Surname}
            color='secondary'
            clickable
            avatar={<Avatar src={citizen.ImageUrl} alt='' />}
            onClick={() => history.push(`/tablet/citizen/${citizen.Id}`)}
        />
    );
}

export default CitizenChip;
