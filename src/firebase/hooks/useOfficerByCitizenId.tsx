import React from 'react';
import IOfficer from '../../../functions/src/models/officer.interface';
import firebase from 'firebase';

export function useOfficerByCitizenIdHook(
    citizenId: string
): {
    value: IOfficer | undefined;
    isLoading: boolean;
} {
    const [officer, setOfficer] = React.useState<IOfficer | undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!citizenId) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('officers')
            .where('Citizen.Id', '==', citizenId)
            .onSnapshot((query) => {
                if (!query.empty) {
                    setOfficer(query.docs[0].data() as IOfficer | undefined);
                }
                setIsLoading(false);
            });
    }, [citizenId]);

    return {
        value: officer,
        isLoading,
    };
}
