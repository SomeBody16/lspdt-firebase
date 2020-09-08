import React from 'react';
import IRank from '../../../functions/src/models/rank.interface';
import firebase from 'firebase';

export function useRankHook(
    rankId: string | undefined
): {
    value: IRank | undefined;
    isLoading: boolean;
} {
    const [rank, setRank] = React.useState<IRank | undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!rankId) return;
        setIsLoading(true);
        return firebase
            .firestore()
            .collection('ranks')
            .doc(rankId)
            .onSnapshot((doc) => {
                setRank({
                    ...(doc.data() as IRank),
                    Id: doc.id,
                });
                setIsLoading(false);
            });
    }, [rankId]);

    return {
        value: rank,
        isLoading,
    };
}
