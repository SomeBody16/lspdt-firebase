import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import IOfficer from '../../../functions/src/models/officer.interface';
import { Chip, Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chip: {
            margin: theme.spacing(1),
        },
    })
);

interface Props {
    officer: IOfficer;
}

function OfficerChip(props: Props) {
    const classes = useStyles();

    let officerName = '';
    officerName += `${props?.officer?.Citizen?.Name} `;
    officerName += `${props?.officer?.Citizen?.Surname} `;
    officerName += `| `;
    officerName += `${props?.officer?.Rank?.Name}`;

    return (
        <Chip
            className={classes.chip}
            label={officerName}
            avatar={<Avatar>{props?.officer?.Rank?.Callsign}</Avatar>}
            color='primary'
        />
    );
}

export default OfficerChip;
