import IOfficer from './officer.interface';
import IPrefix from './prefix.interface';
import ICitizen from './citizen.interface';
import ICrime from './crime.interface';

export default interface IRegistration {
    Server: string;
    Id: string;
    Citizen: ICitizen;
    Prefixes: IPrefix[];
    Title: string;
    Description?: string;
    OfficerAuthor: IOfficer;
    CreateTime: number;
    ImageUrl?: string;
    Crimes?: ICrime[];
}
