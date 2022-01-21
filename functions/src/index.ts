import * as admin from 'firebase-admin';
import { setCitizenPhoneNumberCall } from './callable/citizen/setCitizenPhoneNumber';
import { makeCitizenRegistrationCall } from './callable/citizen/makeCitizenRegistration';
import { recruitCitizenCall } from './callable/citizen/recruitCitizen';
import { cancelWantedCall } from "./callable/citizen/cancelWanted";
import { setCitizenPhotoCall } from './callable/citizen/setCitizenPhoto';
import { makeCitizenWantedCall } from './callable/citizen/arrestMandate/makeCitizenWanted';
import { confirmArrestMandateCall } from './callable/citizen/arrestMandate/confirmArrestMandate';
import { updateOfficerBadgeNumberCall } from './callable/officer/updateOfficerBadgeNumber';
import { setOfficerRankCall } from './callable/officer/setOfficerRank';
import { fireOfficerCall } from './callable/officer/fireOfficer';

import { addCrimeCall } from './callable/config/crimes/addCrime';
import { editCrimeCall } from './callable/config/crimes/editCrime';
import { deleteCrimeCall } from './callable/config/crimes/deleteCrime';

import { addPrefixCall } from './callable/config/prefixes/addPrefix';
import { editPrefixCall } from './callable/config/prefixes/editPrefix';
import { deletePrefixCall } from './callable/config/prefixes/deletePrefix';
import { listPermissionsCall } from './callable/listPermissions';
import { addRankCall } from './callable/config/ranks/addRank';
import { editRankCall } from './callable/config/ranks/editRank';
import { deleteRankCall } from './callable/config/ranks/deleteRank';
import { createChiefCall } from './callable/server/createChief';
import { createCitizenCall } from './callable/server/createCitizen';
import { findByIdScanCall } from './callable/citizen/findByIdScan';
import {removeRegistrationCall} from "./callable/citizen/removeRegistration";
import {changeRecidivismCall} from "./callable/citizen/arrestMandate/changeRecidivism";
import {updateCitizenInfoCall} from "./callable/citizen/updateCitizenInfo";
import {exportRegistryCall} from "./callable/server/export-registry";
import {cancelWantedScheduleCall} from "./scheduled/cancelWanted";

admin.initializeApp();
admin.firestore().settings({
    ignoreUndefinedProperties: true,
});

// Citizen
export const setCitizenPhoneNumber = setCitizenPhoneNumberCall;
export const makeCitizenRegistration = makeCitizenRegistrationCall;
export const recruitCitizen = recruitCitizenCall;
export const setCitizenPhoto = setCitizenPhotoCall;
export const makeCitizenWanted = makeCitizenWantedCall;
export const cancelWanted = cancelWantedCall;
export const confirmArrestMandate = confirmArrestMandateCall;
export const changeRecidivism = changeRecidivismCall;
export const findByIdScan = findByIdScanCall;
export const removeRegistration = removeRegistrationCall;
export const updateCitizenInfo = updateCitizenInfoCall;

// Officer
export const updateOfficerBadgeNumber = updateOfficerBadgeNumberCall;
export const setOfficerRank = setOfficerRankCall;
export const fireOfficer = fireOfficerCall;

// Crimes
export const addCrime = addCrimeCall;
export const editCrime = editCrimeCall;
export const deleteCrime = deleteCrimeCall;

// Prefixes
export const addPrefix = addPrefixCall;
export const editPrefix = editPrefixCall;
export const deletePrefix = deletePrefixCall;

// Ranks
export const addRank = addRankCall;
export const editRank = editRankCall;
export const deleteRank = deleteRankCall;

// Permissions
export const listPermissions = listPermissionsCall;

// Server
export const createChief = createChiefCall;
export const createCitizen = createCitizenCall;
export const exportRegistry = exportRegistryCall;

export const cancelWantedSchedule = cancelWantedScheduleCall;
