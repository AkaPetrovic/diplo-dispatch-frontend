"use client";

import Manufacturer from "@/app/types/Manufacturer";
import Truck from "@/app/types/Truck";
import { useEffect, useState } from "react";

const AddTruckPage = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>();
  const [truckData, setTruckData] = useState<Truck>({
    model: "",
    power: 0,
    kilometersTravelled: 0,
    year: 0,
    carryingCapacity: 0,
    manufacturer: { id: 0, name: "" }, //temporary value until the manufacturers are loaded
  });

  const [selectedManufacturerId, setSelectedManufacturerId] = useState(0);

  //Getting the manufacturers
  useEffect(() => {
    const getManufacturers = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const resManufacturers = await fetch(
        "http://localhost:8080/api/manufacturers",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      const manufacturersData = await resManufacturers.json();
      setManufacturers(manufacturersData);
    };

    getManufacturers();
  }, []);

  //Updating the manufacturer after the manufacturers have loaded
  useEffect(() => {
    if (manufacturers && manufacturers.length > 0) {
      setTruckData((prevData) => ({
        ...prevData,
        manufacturer: manufacturers[0], // Default to the first manufacturer
      }));

      setSelectedManufacturerId(manufacturers[0].id);
    }
  }, [manufacturers]);

  //For handling manufacturer change
  useEffect(() => {
    const manufacturerById = manufacturers?.find(
      (manufacturer) => manufacturer.id === selectedManufacturerId,
    );

    //If a manufacturer has been found by the find() function
    if (manufacturerById) {
      setTruckData((prevData) => ({
        ...prevData,
        manufacturer: manufacturerById,
      }));
    }
  }, [selectedManufacturerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTruckData((prevData) => {
      // Initialize the new value to update the state
      let newValue: string | number = value;

      if (
        name === "power" ||
        name === "kilometersTravelled" ||
        name === "year" ||
        name === "carryingCapacity"
      ) {
        if (newValue === "") {
          return { ...prevData, [name]: 0 };
        }

        // Remove leading zero if the value is not "0"
        if (newValue.startsWith("0") && newValue !== "0") {
          newValue = newValue.replace(/^0+/, "");
        }
      }
      // Validate each field based on its name
      switch (name) {
        case "power":
          // Power: non-negative number, up to 3 digits
          if (/^\d{1,3}$/.test(value)) {
            newValue = Number(value);
          } else {
            console.log(
              "Power must be a non-negative number with up to 3 digits.",
            );
            return prevData; // Skip the update if validation fails
          }
          break;

        case "kilometersTravelled":
          // Kilometers Travelled: non-negative decimal, up to 7 digits, and up to 2 decimal places
          if (/^\d{1,7}(\.\d{1,2})?$/.test(value)) {
            newValue = Number(value);
          } else {
            console.log(
              "Kilometers Travelled must be a non-negative number with up to 7 digits and 2 decimal places.",
            );
            return prevData;
          }
          break;

        case "year":
          // Year: number greater than 1990
          if (Number(value) > 1990) {
            newValue = Number(value);
          } else {
            console.log("Year must be greater than 1990.");
            return prevData;
          }
          break;

        case "carryingCapacity":
          // Carrying Capacity: non-negative decimal, up to 3 digits, and up to 2 decimal places
          if (/^\d{1,3}(\.\d{1,2})?$/.test(value)) {
            newValue = Number(value);
          } else {
            console.log(
              "Carrying Capacity must be a non-negative number with up to 3 digits and 2 decimal places.",
            );
            return prevData;
          }
          break;

        default:
          // For all other fields, just use the value as a string
          newValue = value;
          break;
      }

      // Return the updated state
      return {
        ...prevData,
        [name]: newValue,
      };
    });
  };

  const removeLeadingZeros = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (input.value.startsWith("0") && input.value.length > 1) {
      input.value = input.value.replace(/^0+/, ""); // Remove leading zeros visually
    }
  };

  console.log(truckData);

  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-1/4 min-w-fit px-8 py-5 shadow">
        <div className="flex justify-center">
          <h1 className="mb-7 w-full max-w-xs">Add new truck</h1>
        </div>

        <form className="flex flex-col items-center gap-3">
          <label className="form-control mb-3 w-full max-w-xs">
            <div className="label">
              <span className="label-text">Select the truck manufacturer</span>
            </div>
            <select
              id="manufacturer"
              name="manufacturer"
              value={selectedManufacturerId}
              onChange={(e) =>
                setSelectedManufacturerId(Number(e.target.value))
              }
              className="select select-bordered"
            >
              {manufacturers?.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
          </label>

          <div className="w-full max-w-xs">
            <label htmlFor="model" className="block px-1 py-2 text-sm">
              Model
            </label>
            <input
              id="model"
              name="model"
              type="text"
              value={truckData.model}
              onChange={handleInputChange}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
          <div className="w-full max-w-xs">
            <label htmlFor="power" className="block px-1 py-2 text-sm">
              Power (HP)
            </label>
            <input
              id="power"
              name="power"
              type="number"
              value={truckData.power}
              onChange={handleInputChange}
              onInput={removeLeadingZeros}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
          <div className="w-full max-w-xs">
            <label
              htmlFor="kilometersTravelled"
              className="block px-1 py-2 text-sm"
            >
              Kilometers travelled
            </label>
            <input
              id="kilometersTravelled"
              name="kilometersTravelled"
              type="number"
              value={truckData.kilometersTravelled}
              onChange={handleInputChange}
              onInput={removeLeadingZeros}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
          <div className="w-full max-w-xs">
            <label htmlFor="year" className="block px-1 py-2 text-sm">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="number"
              value={truckData.year}
              onChange={handleInputChange}
              onInput={removeLeadingZeros}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
          <div className="w-full max-w-xs">
            <label
              htmlFor="carryingCapacity"
              className="block px-1 py-2 text-sm"
            >
              Carrying capacity (t)
            </label>
            <input
              id="carryingCapacity"
              name="carryingCapacity"
              type="number"
              value={truckData.carryingCapacity}
              onChange={handleInputChange}
              onInput={removeLeadingZeros}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddTruckPage;
