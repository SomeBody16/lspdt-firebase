import React from 'react';
import IRegistration from '../../../functions/src/models/registration.interface';
import firebase from 'firebase';

const sizePerPage = 10;

export type TUseCitizenRegistryResult = {
    registry: IRegistration[];
    nextPage: () => void;
    prevPage: () => void;
    currentPage: number;
    isLoading: boolean;
};

export function useCitizenRegistryHook(citizenId: string): TUseCitizenRegistryResult {
    const [registry, setRegistry] = React.useState<IRegistration[]>([]);

    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [lastVisible, setLastVisible] = React.useState<
        firebase.firestore.DocumentSnapshot<any>[]
    >([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [noMore, setNoMore] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!citizenId) return;
        setIsLoading(true);
        let query = firebase
            .firestore()
            .collection('registry')
            .where('Citizen.Id', '==', citizenId)
            .orderBy('CreateTime', 'desc')
            .limit(sizePerPage);

        if (lastVisible.length > 0) {
            query = query.startAfter(lastVisible.pop());
        }

        return query.onSnapshot((query) => {
            const res = query.docs.map((d) => ({
                ...(d.data() as IRegistration),
                Id: d.id,
            }));
            setRegistry(res);
            setIsLoading(false);

            if (query.docs.length < sizePerPage) {
                setNoMore(true);
                return;
            }

            lastVisible.push(query.docs[query.docs.length - 1]);
            setLastVisible(lastVisible);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [citizenId, currentPage]);

    return {
        registry,
        currentPage,
        nextPage: () => {
            if (noMore) return;
            setCurrentPage((page) => page + 1);
        },
        prevPage: () => {
            if (noMore) {
                setNoMore(false);
            }
            setCurrentPage((page) => (page <= 1 ? 1 : page - 1));
        },
        isLoading,
    };
}
