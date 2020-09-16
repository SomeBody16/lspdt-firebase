import React from 'react';
import IRank from '../../../functions/src/models/rank.interface';
import firebase from 'firebase';
import useServer from './useServer';

export function useAllRanksHook(): {
    value: IRank[];
    isLoading: boolean;
} {
    const [ranks, setRanks] = React.useState<IRank[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const Server = useServer();

    React.useEffect(() => {
        if (!Server) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('ranks')
            .where('Server', '==', Server)
            .orderBy('Callsign')
            .orderBy('Name')
            .onSnapshot((query) => {
                setRanks(
                    query.docs.map((doc) => ({
                        ...(doc.data() as IRank),
                        Id: doc.id,
                    }))
                );
                setIsLoading(false);
            });
    }, [Server]);

    return {
        value: ranks,
        isLoading,
    };
}
