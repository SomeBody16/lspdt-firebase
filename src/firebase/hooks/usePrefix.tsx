import React from 'react';
import IPrefix from '../../../functions/src/models/prefix.interface';
import firebase from 'firebase';

export function usePrefixHook(
    prefixId: string | undefined
): {
    value: IPrefix | undefined;
    isLoading: boolean;
} {
    const [prefix, setPrefix] = React.useState<IPrefix | undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!prefixId) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('prefixes')
            .doc(prefixId)
            .onSnapshot((doc) => {
                setPrefix({
                    ...(doc.data() as IPrefix),
                    Id: doc.id,
                });
                setIsLoading(false);
            });
    }, [prefixId]);

    return {
        value: prefix,
        isLoading,
    };
}
