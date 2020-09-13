import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as vision from '@google-cloud/vision';
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

// DEV SERVER
let fireConfig;
switch (process.env.REACT_APP_SERVER) {
    case 'atomicrp':
        fireConfig = {
            apiKey: 'AIzaSyBY-pi_wM6AZd_pqNUMs8zK6czDFEztaHo',
            authDomain: 'fivem-lspdt-atomicrp.firebaseapp.com',
            databaseURL: 'https://fivem-lspdt-atomicrp.firebaseio.com',
            projectId: 'fivem-lspdt-atomicrp',
            storageBucket: 'fivem-lspdt-atomicrp.appspot.com',
            messagingSenderId: '726188988277',
            appId: '1:726188988277:web:ee2a891a480b62d2e0a53c',
            measurementId: 'G-7PJ370ETL0',
        };
        break;

    default:
    case 'dev':
        fireConfig = {
            apiKey: 'AIzaSyCCwGebLXv5FzKoK2WB8appK97jz3idTs8',
            authDomain: 'fivem-lspdt.firebaseapp.com',
            databaseURL: 'https://fivem-lspdt.firebaseio.com',
            projectId: 'fivem-lspdt',
            storageBucket: 'citizens-ids',
            messagingSenderId: '586719319565',
            appId: '1:586719319565:web:7067c9550d952c7ec0e744',
            measurementId: 'G-GJK8TY4WBF',
        };
        break;
}

export const firebaseConfig = fireConfig;

firebase.initializeApp(fireConfig);
if (process.env.REACT_APP_USE_LOCAL_FUNCTIONS) {
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
