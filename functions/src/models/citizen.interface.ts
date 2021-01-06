export default interface ICitizen {
    Server: string;
    Id: string;
    Name: string;
    Surname: string;
    BirthDate: string;
    Height: string;
    CreateTime: number;

    PhoneNumber?: string;
    IsOfficer?: boolean;
    IsChief?: boolean;
    ImageUrl?: string;

    IsWanted?: boolean;
    WantedCrimesIds?: string[];

    Recidivism?: {
        [key: string]: number;
    };
}
