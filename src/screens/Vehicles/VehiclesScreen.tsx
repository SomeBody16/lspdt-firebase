import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { AppBarProgressContext } from '../../components/DrawerContainer/DrawerContainer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // Component styles
    })
);

function VehiclesScreen() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const classes = useStyles();

    const [t] = useTranslation('common');
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
        setAppBarProgress('indeterminate');
    }, [setAppBarProgress, plate]);

    return (
        <TextField
            label={t('vehicle.details.plate')}
            variant='outlined'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={plate.length === 8}
        />
    );
}

export default VehiclesScreen;
