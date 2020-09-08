import React from 'react';
import IPrefix from '../../../functions/src/models/prefix.interface';
import firebase from 'firebase';

export function useAllPrefixesHook(): {
    value: IPrefix[];
    isLoading: boolean;
} {
    const [prefixes, setPrefixes] = React.useState<IPrefix[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('prefixes')
            .onSnapshot((query) => {
                setPrefixes(
                    query.docs.map((doc) => ({
                        ...(doc.data() as IPrefix),
                        Id: doc.id,
                    }))
                );
                setIsLoading(false);
            });
    }, []);

    return {
        value: prefixes,
        isLoading,
    };
}
