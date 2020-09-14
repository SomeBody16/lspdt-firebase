import React from 'react';
import ICrime from '../../../functions/src/models/crime.interface';
import firebase from 'firebase';
import useServer from './useServer';

export function useAllCrimesHook(): {
    value: ICrime[];
    isLoading: boolean;
} {
    const [crimes, setCrimes] = React.useState<ICrime[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const Server = useServer();

    React.useEffect(() => {
        if (!Server) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('crimes')
            .where('Server', '==', Server)
            .orderBy('Prefix.Description')
            .orderBy('Name')
            .onSnapshot((query) => {
                setCrimes(
                    query.docs.map((d) => ({
                        ...(d.data() as ICrime),
                        Id: d.id,
                    }))
                );
                setIsLoading(false);
            });
    }, [Server]);

    return {
        value: crimes,
        isLoading,
    };
}
