import Driver from "./Driver";

export default interface TruckLoad {
  id?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // hh:mm:ss
  endTime: string; // hh:mm:ss
  incomePerKilometer: number;
  driver: Driver;
}
