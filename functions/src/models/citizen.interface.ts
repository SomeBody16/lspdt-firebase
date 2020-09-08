export default interface ICitizen {
    Id: string;
    Name: string;
    Surname: string;
    BirthDate: string;
    CreateTime: number;

    PhoneNumber?: string;
    IsOfficer?: boolean;
    IsChief?: boolean;
    ImageUrl?: string;

    IsWanted?: boolean;
    WantedCrimesIds?: string[];
}
