import Truck from "./Truck";

export default interface Driver {
  id?: number;
  name: string;
  surname: string;
  birthdate: string; // Store as string in "YYYY-MM-DD"
  truck: Truck;
}
