import Truck from "./Truck";

export default interface Driver {
  id?: number;
  name: string;
  surname: string;
  birthdate: string; // YYYY-MM-DD
  truck: Truck;
}
