import React from 'react';
import firebase from 'firebase';
import IUserClaims from '../../../functions/src/models/user-claims.interface';

export function useClaimsHook(): {
    value: IUserClaims | undefined;
    isLoading: boolean;
} {
    const [claims, setClaims] = React.useState<IUserClaims | undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const currentUser = firebase.auth().currentUser;
    React.useEffect(() => {
        setIsLoading(true);
        const readPermissions = async () => {
            const idTokenResult = await currentUser?.getIdTokenResult();
            if (!idTokenResult) {
                return setClaims({});
            }
            setClaims(idTokenResult.claims);
            setIsLoading(false);
        };
        readPermissions();
    }, [currentUser]);

    return React.useMemo(
        () => ({
            value: claims,
            isLoading,
        }),
        [claims, isLoading]
    );
}
