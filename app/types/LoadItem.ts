import LoadItemId from "./LoadItemId";

export default interface LoadItem {
  id?: LoadItemId;
  name: string;
  dangerous: boolean;
  fragile: boolean;
  weight: number;
  volume: number;
  tableRow?: number;
}
