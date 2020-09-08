import React from 'react';
import ICitizen from '../../../functions/src/models/citizen.interface';
import firebase from 'firebase';

export function useCitizenHook(
    citizenId: string | undefined
): {
    value: ICitizen | undefined;
    isLoading: boolean;
} {
    const [citizen, setCitizen] = React.useState<ICitizen | undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!citizenId) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('citizens')
            .doc(citizenId)
            .onSnapshot((citizen) => {
                setCitizen({
                    ...(citizen.data() as ICitizen),
                    Id: citizenId,
                });
                setIsLoading(false);
            });
    }, [citizenId]);

    return {
        value: citizen,
        isLoading,
    };
}
