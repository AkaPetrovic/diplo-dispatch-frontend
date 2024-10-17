import Driver from "../types/Driver";
import LoadItem from "../types/LoadItem";
import Manufacturer from "../types/Manufacturer";
import Truck from "../types/Truck";
import TruckLoad from "../types/TruckLoad";

export const generateDefaultLoadItem = () => {
  const defaultLoadItem: LoadItem = {
    name: "",
    dangerous: false,
    fragile: false,
    weight: 0,
    volume: 0,
    tableRow: -1,
  };
  return defaultLoadItem;
};

export const generateDefaultTruckLoad = () => {
  const defaultTruckLoad: TruckLoad = {
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    incomePerKilometer: 0,
    driver: generateDefaultDriver(),
  };
  return defaultTruckLoad;
};

export const generateDefaultDriver = () => {
  const defaultDriver: Driver = {
    name: "",
    surname: "",
    birthdate: "",
    truck: generateDefaultTruck(),
  };
  return defaultDriver;
};

export const generateDefaultTruck = () => {
  const defaultTruck: Truck = {
    model: "",
    power: 0,
    kilometersTravelled: 0,
    year: 0,
    carryingCapacity: 0,
    manufacturer: generateDefaultManufacturer(),
  };
  return defaultTruck;
};

export const generateDefaultManufacturer = () => {
  const defaultManufacturer: Manufacturer = { id: 0, name: "" };
  return defaultManufacturer;
};
