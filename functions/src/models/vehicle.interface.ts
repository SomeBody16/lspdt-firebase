export default interface IVehicle {
    Server: string;
    Id: string;
    Note: string;
    Status: 'OK' | 'STOLEN' | 'WANTED' | 'CONFISCATED';
}
