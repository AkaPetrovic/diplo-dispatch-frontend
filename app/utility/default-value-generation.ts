import Driver from "../types/Driver";
import Manufacturer from "../types/Manufacturer";
import Truck from "../types/Truck";

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
