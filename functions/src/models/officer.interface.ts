import ICitizen from './citizen.interface';
import IRank from './rank.interface';

export default interface IOfficer {
    Id: string;
    Citizen: ICitizen;
    Rank: IRank;
    BadgeNumber: string;

    IsFired?: boolean;
}
