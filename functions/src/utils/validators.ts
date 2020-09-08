import * as validate from 'validate.js';
import * as admin from 'firebase-admin';
import ICitizen from '../models/citizen.interface';
import IPrefix from '../models/prefix.interface';
import ICrime from '../models/crime.interface';
import * as functions from 'firebase-functions';
import { InvalidArgument } from './errors';
import IOfficer from '../models/officer.interface';
import IRank from '../models/rank.interface';
import { AllPermissions } from '../models/user-claims.interface';
import IRegistration from '../models/registration.interface';
import IVehicle from '../models/vehicle.interface';

export const validFirebaseId = async (id: any, collection: string | undefined) => {
    if (
        collection &&
        typeof collection === 'string' &&
        collection.length > 0 &&
        id &&
        typeof id === 'string' &&
        id.length > 0
    ) {
        const doc = await admin.firestore().collection(collection).doc(id).get();
        if (!doc.exists) {
            return `${id} don't exists in ${collection}`;
        }
    }
    return validate.validate(
        { id },
        {
            id: {
                presence: true,
                format: {
                    pattern: '^[a-z0-9]+$',
                    flags: 'i',
                    message: 'docuementIdInvalid',
                },
            },
        }
    );
};

export const validFirebaseIds = async (ids: any[], collection: string | undefined) => {
    for (const id of ids) {
        const res = validFirebaseId(id, collection);
        if (res) {
            return res;
        }
    }
};

export const isPermission = (value: any) => {
    if (!AllPermissions.includes(value)) {
        return 'is not permission';
    }
    return;
};

export const isPermissions = (value: any[]) => {
    const found = [];
    for (const permission of AllPermissions) {
        if (value.includes(permission)) {
            found.push(permission);
        }
    }
    if (found.length !== value.length) {
        return 'is not array of permissions';
    }
    return;
};

export const validImageUrl = (value: string) =>
    !validate.validate({ value }, { value: { url: { allowDataUrl: true } } }) &&
    /\.(jpe?g|png|gif)$/i.test(value);

export const validImageDataUrl = (value: string) =>
    /^data:image\/(jpe?g|png|gif);base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        value
    );

export const validImage = (value: any, options: any) => {
    if (!validImageUrl(value) && !validImageDataUrl(value)) {
        return 'is not valid image url';
    }
    return;
};

export const ModelCitizen = async (value: any, options: (keyof ICitizen)[]) => {
    let fields = options;
    if (fields.length <= 0) {
        fields = [
            'Id',
            'Name',
            'Surname',
            'BirthDate',
            'CreateTime',

            'PhoneNumber',
            'IsOfficer',
            'IsChief',
            'ImageUrl',

            'IsWanted',
            'WantedCrimesIds',
        ];
    }
    await validate
        .async(
            { ...value },
            {
                Id: (!fields || fields.includes('Id')) && {
                    validFirebaseId: 'citizens',
                },
                Name: (!fields || fields.includes('Name')) && {
                    presence: true,
                    type: 'string',
                },
                Surname: (!fields || fields.includes('Surname')) && {
                    presence: true,
                    type: 'string',
                },
                BirthDate: (!fields || fields.includes('BirthDate')) && {
                    presence: true,
                    type: 'string',
                },
                CreateTime: (!fields || fields.includes('CreateTime')) && {
                    presence: true,
                    datetime: true,
                },

                PhoneNumber: (!fields || fields.includes('PhoneNumber')) && {
                    presence: false,
                    format: {
                        pattern: '^[0-9]{3}-[0-9]{4}$',
                    },
                },
                IsOfficer: (!fields || fields.includes('IsOfficer')) && {
                    presence: false,
                    type: 'boolean',
                },
                IsChief: (!fields || fields.includes('IsChief')) && {
                    presence: false,
                    type: 'boolean',
                },
                ImageUrl: (!fields || fields.includes('ImageUrl')) && {
                    presence: false,
                    validImage: true,
                },
                IsWanted: (!fields || fields.includes('IsWanted')) && {
                    presence: false,
                    type: 'boolean',
                },
                WantedCrimesIds: (!fields || fields.includes('WantedCrimesIds')) && {
                    presence: false,
                    validFirebaseIds: 'crimes',
                },
            }
        )
        .catch((err) => {
            throw InvalidArgument(err);
        });
};

export const ModelCrime = async (value: any, options: (keyof ICrime)[]) => {
    let fields = options;
    if (fields.length <= 0) {
        fields = ['Id', 'Name', 'Penalty', 'Judgment', 'Prefix'];
    }
    await validate
        .async(
            { ...value },
            {
                Id: (!fields || fields.includes('Id')) && {
                    validFirebaseId: 'crimes',
                },
                Name: (!fields || fields.includes('Name')) && {
                    presence: true,
                    type: 'string',
                },
                Penalty: (!fields || fields.includes('Penalty')) && {
                    presence: true,
                    numericality: {
                        greaterThanOrEqualTo: 0,
                    },
                },
                Judgment: (!fields || fields.includes('Judgment')) && {
                    presence: true,
                    numericality: {
                        greaterThanOrEqualTo: 0,
                    },
                },
                Prefix: (!fields || fields.includes('Prefix')) && {
                    presence: true,
                    ModelPrefix: [],
                },
            }
        )
        .catch((err) => {
            throw InvalidArgument(err);
        });
};

export const ModelOfficer = async (value: any, options: (keyof IOfficer)[]) => {
    let fields = options;
    if (fields.length <= 0) {
        fields = ['Id', 'Citizen', 'Rank', 'BadgeNumber', 'IsFired'];
    }
    await validate
        .async(
            { ...value },
            {
                Id: (!fields || fields.includes('Id')) && {
                    validFirebaseId: 'officers',
                },
                Citizen: (!fields || fields.includes('Citizen')) && {
                    presence: true,
                    ModelCitizen: [],
                },
                Rank: (!fields || fields.includes('Rank')) && {
                    presence: true,
                    ModelRank: [],
                },
                BadgeNumber: (!fields || fields.includes('BadgeNumber')) && {
                    presence: true,
                    type: 'string',
                },
                IsFired: (!fields || fields.includes('IsFired')) && {
                    presence: false,
                    type: 'boolean',
                },
            }
        )
        .catch((err) => {
            throw InvalidArgument(err);
        });
};

export const ModelPrefix = async (value: any, options: (keyof IPrefix)[]) => {
    let fields = options;
    if (fields.length <= 0) {
        fields = ['Id', 'Content', 'Description'];
    }
    await validate
        .async(
            { ...value },
            {
                Id: (!fields || fields.includes('Id')) && {
                    validFirebaseId: 'prefixes',
                },
                Content: (!fields || fields.includes('Content')) && {
                    presence: true,
                    type: 'string',
                },
                Description: (!fields || fields.includes('Description')) && {
                    presence: true,
                    type: 'string',
                },
            }
        )
        .catch((err) => {
            throw InvalidArgument(err);
        });
};

export const ModelRank = async (value: any, options: (keyof IRank)[]) => {
    let fields = options;
    if (fields.length <= 0) {
        fields = ['Id', 'Name', 'Callsign', 'ImageUrl', 'Permissions'];
    }
    await validate
        .async(
            { ...value },
            {
                Id: (!fields || fields.includes('Id')) && {
                    validFirebaseId: 'ranks',
                },
                Name: (!fields || fields.includes('Name')) && {
                    presence: true,
                    type: 'string',
                },
                Callsign: (!fields || fields.includes('Callsign')) && {
                    presence: true,
                    type: 'string',
                },
                ImageUrl: (!fields || fields.includes('ImageUrl')) && {
                    presence: true,
                    validImage: true,
                },
                Permissions: (!fields || fields.includes('Permissions')) && {
                    presence: true,
                    isPermissions: true,
                },
            }
        )
        .catch((err) => {
            console.error(err);
            throw InvalidArgument(err);
        });
};

export const ModelRegistration = async (value: any, options: (keyof IRegistration)[]) => {
    let fields = options;
    if (fields.length <= 0) {
        fields = [
            'Id',
            'Citizen',
            'Prefixes',
            'Title',
            'Description',
            'OfficerAuthor',
            'CreateTime',
            'ImageUrl',
            'Crimes',
        ];
    }
    await validate
        .async(
            { ...value },
            {
                Id: (!fields || fields.includes('Id')) && {
                    validFirebaseId: 'registry',
                },
                Citizen: (!fields || fields.includes('Citizen')) && {
                    presence: true,
                    ModelCitizen: [],
                },
                Prefixes: (!fields || fields.includes('Prefixes')) && {
                    presence: true,
                    validateArray: (item: any) => ModelPrefix(item, []),
                },
                Title: (!fields || fields.includes('Title')) && {
                    presence: true,
                    type: 'string',
                },
                Description: (!fields || fields.includes('Description')) && {
                    presence: true,
                    type: 'string',
                },

                OfficerAuthor: (!fields || fields.includes('OfficerAuthor')) && {
                    presence: false,
                    ModelOfficer: [],
                },
                CreateTime: (!fields || fields.includes('CreateTime')) && {
                    presence: true,
                    datetime: true,
                },
                ImageUrl: (!fields || fields.includes('ImageUrl')) && {
                    presence: false,
                    validImage: true,
                },
                Crimes: (!fields || fields.includes('Crimes')) && {
                    presence: false,
                    validateArray: (item: any) => ModelCrime(item, []),
                },
            }
        )
        .catch((err) => {
            throw InvalidArgument(err);
        });
};

export const ModelVehicle = async (value: any, options: (keyof IVehicle)[]) => {
    let fields = options;
    if (fields.length <= 0) {
        fields = ['Id', 'Note', 'Status'];
    }
    await validate
        .async(
            { ...value },
            {
                Id: (!fields || fields.includes('Id')) && {
                    validFirebaseId: 'vehicles',
                },
                Note: (!fields || fields.includes('Note')) && {
                    presence: true,
                    type: 'string',
                },
                Status: (!fields || fields.includes('Status')) && {
                    presence: true,
                    type: 'string',
                    inclusion: {
                        within: ['OK', 'STOLEN'],
                    },
                },
            }
        )
        .catch((err) => {
            throw InvalidArgument(err);
        });
};

const injectValidators = () => {
    // validate.validators.format = format;
    validate.validators.validFirebaseId = validFirebaseId;
    validate.validators.validFirebaseIds = validFirebaseIds;
    validate.validators.isPermission = isPermission;
    validate.validators.isPermissions = isPermissions;
    validate.validators.validImage = validImage;

    validate.validators.ModelCitizen = ModelCitizen;
    validate.validators.ModelCrime = ModelCrime;
    validate.validators.ModelOfficer = ModelOfficer;
    validate.validators.ModelPrefix = ModelPrefix;
    validate.validators.ModelRank = ModelRank;
    validate.validators.ModelRegistration = ModelRegistration;
    validate.validators.ModelVehicle = ModelVehicle;
};

export const requireValidated = async (
    attributes: any,
    constraints: any
): Promise<functions.https.HttpsError | undefined> => {
    injectValidators();

    await validate.async(attributes, constraints).catch((error) => {
        console.error({ details: JSON.stringify(error.details) });
        throw InvalidArgument(error);
    });
    return undefined;
};
