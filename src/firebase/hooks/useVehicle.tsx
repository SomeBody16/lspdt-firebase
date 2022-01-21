import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import IVehicle from "../../../functions/src/models/vehicle.interface";

export function useVehicleHook(
    plate: string | undefined
): {
    value: IVehicle | undefined;
    isLoading: boolean;
} {
    const [vehicle, setVehicle] = React.useState<IVehicle | undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!plate || plate.length !== 8) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('vehicles')
            .doc(plate)
            .onSnapshot((vehicle) => {
                setVehicle({
                    ...(vehicle.data() as IVehicle),
                    Id: plate,
                });
                setIsLoading(false);
            }, err => console.error({err}));
    }, [plate]);

    return {
        value: vehicle,
        isLoading,
    };
}
