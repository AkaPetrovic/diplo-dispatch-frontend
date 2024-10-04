import Manufacturer from "./Manufacturer";

export default interface Truck {
  id?: number;
  model: string;
  power: number;
  kilometersTravelled: number;
  year: number;
  carryingCapacity: number;
  manufacturer: Manufacturer;
}
