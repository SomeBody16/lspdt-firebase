import React from 'react';
import ICrime from '../../../functions/src/models/crime.interface';
import firebase from 'firebase';

export function useCrimeHook(
    crimeId: string | undefined
): {
    value: ICrime | undefined;
    isLoading: boolean;
} {
    const [crime, setCrime] = React.useState<ICrime | undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!crimeId) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('crimes')
            .doc(crimeId)
            .onSnapshot((doc) => {
                setCrime({
                    ...(doc.data() as ICrime),
                    Id: doc.id,
                });
                setIsLoading(false);
            });
    }, [crimeId]);

    return {
        value: crime,
        isLoading,
    };
}
