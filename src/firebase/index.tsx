import 'firebase/analytics';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAllCrimesHook } from './hooks/useAllCrimes';
import { useAllOfficersHook } from './hooks/useAllOfficers';
import { useAllPermissionsHook } from './hooks/useAllPermissions';
import { useAllPrefixesHook } from './hooks/useAllPrefixes';
import { useAllRanksHook } from './hooks/useAllRanks';
import { useAuthChangedHook } from './hooks/useAuthChanged';
import { useCitizenHook } from './hooks/useCitizen';
import { useCitizenRegistryHook } from './hooks/useCitizenRegistry';
import { useClaimsHook } from './hooks/useClaims';
import { useCrimeHook } from './hooks/useCrime';
import { useFunctionHook } from './hooks/useFunction';
import { useOfficerHook } from './hooks/useOfficer';
import { useOfficerByCitizenIdHook } from './hooks/useOfficerByCitizenId';
import { usePrefixHook } from './hooks/usePrefix';
import { useRankHook } from './hooks/useRank';
import { useWantedListHook } from './hooks/useWantedList';

export const firebaseConfig = {
  apiKey: 'AIzaSyCm-HAZ6eUG85SeiuexjMKoMZHjAmYRlbo',
  authDomain: 'lpsdt-3-0.firebaseapp.com',
  projectId: 'lpsdt-3-0',
  storageBucket: 'lpsdt-3-0.appspot.com',
  messagingSenderId: '756709062275',
  appId: '1:756709062275:web:86c1c5a4f5bb095fa5cdb6',
  measurementId: 'G-136ZZ4HX7H',
};
//
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const useAllCrimes = useAllCrimesHook;
export const useAllOfficers = useAllOfficersHook;
export const useAllPermissions = useAllPermissionsHook;
export const useAllPrefixes = useAllPrefixesHook;
export const useAllRanks = useAllRanksHook;
export const useAuthChanged = useAuthChangedHook;
export const useCitizen = useCitizenHook;
export const useCitizenRegistry = useCitizenRegistryHook;
export const useClaims = useClaimsHook;
export const useCrime = useCrimeHook;
export const useFunction = useFunctionHook;
export const useOfficer = useOfficerHook;
export const useOfficerByCitizenId = useOfficerByCitizenIdHook;
export const usePrefix = usePrefixHook;
export const useRank = useRankHook;
export const useWantedList = useWantedListHook;
