import React from 'react';
import IPrefix from '../../../functions/src/models/prefix.interface';
import firebase from 'firebase';
import useServer from './useServer';

export function useAllPrefixesHook(): {
    value: IPrefix[];
    isLoading: boolean;
} {
    const [prefixes, setPrefixes] = React.useState<IPrefix[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const Server = useServer();

    React.useEffect(() => {
        if (!Server) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('prefixes')
            .where('Server', '==', Server)
            .onSnapshot((query) => {
                setPrefixes(
                    query.docs.map((doc) => ({
                        ...(doc.data() as IPrefix),
                        Id: doc.id,
                    }))
                );
                setIsLoading(false);
            });
    }, [Server]);

    return {
        value: prefixes,
        isLoading,
    };
}
