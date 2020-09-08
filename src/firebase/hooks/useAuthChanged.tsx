import React from 'react';
import firebase from 'firebase';

export function useAuthChangedHook(
    callback?: (user: firebase.User | null) => void
): firebase.User | null {
    const [user, setUser] = React.useState<firebase.User | null>(null);

    React.useEffect(() => {
        return firebase.auth().onAuthStateChanged((user) => {
            setUser(user);
            callback && callback(user);
        });
    }, [callback]);

    return user;
}
