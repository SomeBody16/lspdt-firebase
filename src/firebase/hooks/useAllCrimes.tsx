import React from 'react';
import ICrime from '../../../functions/src/models/crime.interface';
import firebase from 'firebase';

export function useAllCrimesHook(): {
    value: ICrime[];
    isLoading: boolean;
} {
    const [crimes, setCrimes] = React.useState<ICrime[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('crimes')
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
    }, []);

    return {
        value: crimes,
        isLoading,
    };
}
