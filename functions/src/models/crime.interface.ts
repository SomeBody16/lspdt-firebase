import IPrefix from './prefix.interface';

export default interface ICrime {
    Id: string;
    Name: string;
    Penalty: number;
    Judgment: number;
    Prefix: IPrefix;
}
