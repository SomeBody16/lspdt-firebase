import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
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
import {useWantedListHook} from "./hooks/useWantedList";
import {useVehicleHook} from "./hooks/useVehicle";
import {useVehicleListStatusHook} from "./hooks/useVehicleListStatus";

export const firebaseConfig = {
    apiKey: 'AIzaSyDS59MYfwpfZYWGi9Ur9qdmNQsdJneOETw',
    authDomain: 'lspdt-fivem-prod.firebaseapp.com',
    databaseURL: 'https://lspdt-fivem-prod.firebaseio.com',
    projectId: 'lspdt-fivem-prod',
    storageBucket: 'lspdt-fivem-prod.appspot.com',
    messagingSenderId: '68944789384',
    appId: '1:68944789384:web:6fff34d573fb442fcf043d',
    measurementId: 'G-7Y548ZRY5T',
};
//
firebase.initializeApp(firebaseConfig);
firebase.analytics();
if (process.env.REACT_APP_USE_LOCAL_FUNCTIONS === 'true') {
    firebase.functions().useFunctionsEmulator('http://localhost:5001');
}

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
export const useVehicle = useVehicleHook;
export const useVehicleListStatus = useVehicleListStatusHook;
