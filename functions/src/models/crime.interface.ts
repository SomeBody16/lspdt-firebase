import IPrefix from './prefix.interface';

export default interface ICrime {
    Server: string;
    Id: string;
    Name: string;
    Penalty: number;
    Judgment: number;
    Prefix: IPrefix;

    Recidivism?: boolean;
}
