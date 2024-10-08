"use client";

import DialogModal from "@/app/components/DialogModal";
import InputField from "@/app/components/InputField";
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

  const [errorMessage, setErrorMessage] = useState("");

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  useEffect(() => {
    setErrorMessage("");

    if (truckData.model !== "") {
      setIsSaveButtonDisabled(false);
    } else {
      setIsSaveButtonDisabled(true);
    }
  }, [truckData]);

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

  const removeLeadingZeros = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (input.value.startsWith("0") && input.value.length > 1) {
      input.value = input.value.replace(/^0+/, ""); // Remove leading zeros visually
    }
  };

  const validateInput = () => {
    if (truckData.year < 1990) {
      setErrorMessage("Year cannot be a number less than 1990");
      return false;
    }
    return true;
  };

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);
  };

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
            return prevData; // Skip the update if validation fails
          }
          break;

        case "kilometersTravelled":
          // Kilometers Travelled: non-negative decimal, up to 7 digits, and up to 2 decimal places
          if (/^\d{1,7}(\.\d{1,2})?$/.test(value)) {
            newValue = Number(value);
          } else {
            return prevData;
          }
          break;

        case "year":
          // Year: accept non-negative numbers that are up to 4 digits long
          if (/^\d{1,4}$/.test(value)) {
            newValue = Number(value);
          } else {
            return prevData;
          }
          break;

        case "carryingCapacity":
          // Carrying Capacity: non-negative decimal, up to 3 digits, and up to 2 decimal places
          if (/^\d{1,3}(\.\d{1,2})?$/.test(value)) {
            newValue = Number(value);
          } else {
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await fetch("http://localhost:8080/api/trucks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(truckData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.text();
      setDialogModalMessage(result);
      setIsDialogOpen(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-1/4 min-w-fit px-8 py-5 shadow">
        <div className="flex flex-col">
          <h1 className="mb-2">Add new truck</h1>
          <p className="w-full max-w-xs text-sm">
            Fields marked with * are required
          </p>
          {errorMessage ? (
            <p className="w-full max-w-xs text-red-500">{errorMessage}</p>
          ) : null}
        </div>

        <form onSubmit={handleSave} className="mt-7 flex flex-col gap-3">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Manufacturer*</span>
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

          <InputField
            id="model"
            name="model"
            type="text"
            value={truckData.model}
            label="Model*"
            autoComplete="off"
            onChange={handleInputChange}
          />
          <InputField
            id="power"
            name="power"
            type="number"
            value={truckData.power}
            label="Power (HP)*"
            onChange={handleInputChange}
            onInput={removeLeadingZeros}
          />
          <InputField
            id="kilometersTravelled"
            name="kilometersTravelled"
            type="number"
            value={truckData.kilometersTravelled}
            label="Kilometers travelled*"
            onChange={handleInputChange}
            onInput={removeLeadingZeros}
          />
          <InputField
            id="year"
            name="year"
            type="number"
            value={truckData.year}
            label="Year*"
            onChange={handleInputChange}
            onInput={removeLeadingZeros}
          />
          <InputField
            id="carryingCapacity"
            name="carryingCapacity"
            type="number"
            value={truckData.carryingCapacity}
            label="Carrying Capacity (tons)*"
            onChange={handleInputChange}
            onInput={removeLeadingZeros}
          />
          <button
            type="submit"
            disabled={isSaveButtonDisabled}
            className="btn btn-neutral mt-10 w-full max-w-xs rounded-full"
          >
            Save
          </button>
        </form>
      </div>

      {/* Modal dialog box */}
      <DialogModal
        message={dialogModalMessage}
        isOpen={isDialogOpen}
        onClose={handleDialogModalClose}
      />
    </main>
  );
};

export default AddTruckPage;
