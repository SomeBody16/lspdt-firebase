import React from 'react';
import IRegistration from '../../../functions/src/models/registration.interface';
import firebase from 'firebase';
import useServer from './useServer';
import ICitizen from "../../../functions/src/models/citizen.interface";

const sizePerPage = 10;

export type TUseWantedListResult = ICitizen[];

export function useWantedListHook(): TUseWantedListResult {
  const [citizens, setCitizens] = React.useState<ICitizen[]>([]);

  const Server = useServer();

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [lastVisible, setLastVisible] = React.useState<
    firebase.firestore.DocumentSnapshot<any>[]
    >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [noMore, setNoMore] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!Server) return;
    setIsLoading(true);
    let query = firebase
      .firestore()
      .collection('citizens')
      .where('Server', '==', Server)
      .where('IsWanted', '==', true)
      /// I FINISHED HERE
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
  }, [citizenId, currentPage, Server]);

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