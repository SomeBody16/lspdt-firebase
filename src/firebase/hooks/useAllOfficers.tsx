import React from 'react';
import IOfficer from '../../../functions/src/models/officer.interface';
import firebase from 'firebase';

export function useAllOfficersHook(): {
    value: IOfficer[];
    isLoading: boolean;
} {
    const [officers, setOfficers] = React.useState<IOfficer[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('officers')
            .where('IsFired', '==', false)
            .orderBy('BadgeNumber', 'desc')
            .onSnapshot((query) => {
                setOfficers(
                    query.docs.map((doc) => ({
                        ...(doc.data() as IOfficer),
                        Id: doc.id,
                    }))
                );
                setIsLoading(false);
            });
    }, []);

    return {
        value: officers,
        isLoading,
    };
}
