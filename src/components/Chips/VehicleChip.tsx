import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Chip } from '@material-ui/core';
import IVehicle from "../../../functions/src/models/vehicle.interface";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chip: {
            margin: theme.spacing(0.5),
        },
    })
);

function VehicleChip(vehicle: IVehicle) {
    const classes = useStyles();

    return (
        <Chip
            className={classes.chip}
            label={vehicle.Id}
            color='secondary'
        />
    );
}

export default VehicleChip;
