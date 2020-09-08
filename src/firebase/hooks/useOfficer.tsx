import React from 'react';
import IOfficer from '../../../functions/src/models/officer.interface';
import firebase from 'firebase';
import { useAuthChangedHook } from './useAuthChanged';

export function useOfficerHook(
    officerId?: string
): {
    value: IOfficer | undefined;
    isLoading: boolean;
} {
    const user = useAuthChangedHook();
    const [officer, setOfficer] = React.useState<IOfficer>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!user && !officerId) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('officers')
            .doc(officerId || user?.uid)
            .onSnapshot((doc) => {
                setOfficer({
                    ...(doc.data() as IOfficer),
                    Id: doc.id,
                });
                setIsLoading(false);
            });
    }, [user]);

    return {
        value: officer,
        isLoading,
    };
}
