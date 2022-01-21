import React, {useCallback} from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {Divider, MenuItem, TextField} from '@material-ui/core';
import {AppBarProgressContext} from "../../components/DrawerContainer/DrawerContainer";
import {useFunction, useVehicle, useVehicleListStatus} from "../../firebase";
import VehicleChip from "../../components/Chips/VehicleChip";
import IVehicle from "../../../functions/src/models/vehicle.interface";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            height: '100%',
        },
    })
);

function VehicleInfo(vehicle: IVehicle) {
    const { enqueueSnackbar } = useSnackbar();
    const setAppBarProgress = React.useContext(AppBarProgressContext);
    const setVehicleStatus = useFunction('setVehicleStatus');
    
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setAppBarProgress('indeterminate');
        setVehicleStatus({
            plate: vehicle.Id,
            status: event.target.value,
        })
            .then(() => {
                enqueueSnackbar('Zmieniono status!', {
                    variant: 'success',
                });
            })
            .finally(() => {
                setAppBarProgress(null);
            });
    }, [enqueueSnackbar, setAppBarProgress, setVehicleStatus, vehicle.Id]);

    return (
        <TextField
            select
            style={{marginLeft: '1rem', width: '10rem'}}
            variant='filled'
            label={'Status'}
            value={vehicle.Status || 'OK'}
            onChange={handleChange}
        >
            <MenuItem value={'OK'}>Brak</MenuItem>
            <MenuItem value={'WANTED'}>Poszukiwany</MenuItem>
            <MenuItem value={'STOLEN'}>Skradziony</MenuItem>
            <MenuItem value={'CONFISCATED'}>Zarekwirowany</MenuItem>
        </TextField>
    );
}

function VehiclesScreen() {
    const classes = useStyles();

    const setAppBarProgress = React.useContext(AppBarProgressContext);

    const [value, setValue] = React.useState<string>('');
    const [plate, setPlate] = React.useState<string>('');

    React.useEffect(() => {
        if (value.length < 8) return;
        if (value.length > 8) {
            setValue(value.slice(0, 8));
            return;
        }
        setPlate(value);
    }, [value]);

    React.useEffect(() => {
        if (!plate.match(/.{8}/)) return;
    }, [setAppBarProgress, plate]);

    const vehicle = useVehicle(plate);
    React.useEffect(() => {
        setAppBarProgress(vehicle.isLoading ? 'indeterminate' : null);
    }, [setAppBarProgress, vehicle.isLoading]);

    const vehiclesWanted = useVehicleListStatus('WANTED');
    const vehiclesStolen = useVehicleListStatus('STOLEN');
    const vehiclesConfiscated = useVehicleListStatus('CONFISCATED');

    return (
        <div className={classes.root}>
            <div>
                <TextField
                    label={'Rejestracja pojazdu'}
                    variant='filled'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={plate.length === 8 && vehicle.isLoading}
                />

                {vehicle.value && (
                    <VehicleInfo {...vehicle.value} />
                )}
            </div>
            <Divider/>
            <div>
                <h3>Poszukiwane</h3>
                {vehiclesWanted.value.map(v => (
                    <VehicleChip {...v} key={v.Id} />
                ))}
            </div>
            <Divider/>
            <div>
                <h3>Skradzione</h3>
                {vehiclesStolen.value.map(v => (
                    <VehicleChip {...v} key={v.Id} />
                ))}
            </div>
            <Divider/>
            <div>
                <h3>Zarekwirowane</h3>
                {vehiclesConfiscated.value.map(v => (
                    <VehicleChip {...v} key={v.Id} />
                ))}
            </div>
        </div>
    )
}

export default VehiclesScreen;
