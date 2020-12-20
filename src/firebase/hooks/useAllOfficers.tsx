import React from 'react';
import IOfficer from '../../../functions/src/models/officer.interface';
import firebase from 'firebase';
import useServer from './useServer';

export function useAllOfficersHook(): {
    value: IOfficer[];
    isLoading: boolean;
} {
    const [officers, setOfficers] = React.useState<IOfficer[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const Server = useServer();

    React.useEffect(() => {
        if (!Server) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('officers')
            .where('Server', '==', Server)
            .where('IsFired', '==', false)
            .orderBy('BadgeNumber', 'asc')
            .onSnapshot((query) => {
                setOfficers(
                    query.docs.map((doc) => ({
                        ...(doc.data() as IOfficer),
                        Id: doc.id,
                    }))
                );
                setIsLoading(false);
            });
    }, [Server]);

    return {
        value: officers,
        isLoading,
    };
}
