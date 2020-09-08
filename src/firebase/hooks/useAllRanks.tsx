import React from 'react';
import IRank from '../../../functions/src/models/rank.interface';
import firebase from 'firebase';

export function useAllRanksHook(): {
    value: IRank[];
    isLoading: boolean;
} {
    const [ranks, setRanks] = React.useState<IRank[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('ranks')
            .orderBy('Callsign')
            .onSnapshot((query) => {
                setRanks(
                    query.docs.map((doc) => ({
                        ...(doc.data() as IRank),
                        Id: doc.id,
                    }))
                );
                setIsLoading(false);
            });
    }, []);

    return {
        value: ranks,
        isLoading,
    };
}
