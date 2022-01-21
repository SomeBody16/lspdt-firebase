import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import IVehicle from "../../../functions/src/models/vehicle.interface";

export function useVehicleListStatusHook(
    status: IVehicle['Status']
): {
    value: IVehicle[];
    isLoading: boolean;
} {
    const [vehicles, setVehicles] = React.useState<IVehicle[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('vehicles')
            .where('Status', '==', status)
            .onSnapshot((query) => {
                setVehicles(query.docs.map(doc => ({
                    ...(doc.data() as IVehicle),
                    Id: doc.id,
                })));
                setIsLoading(false);
            }, err => console.error({err}));
    }, [status]);

    return {
        value: vehicles,
        isLoading,
    };
}
