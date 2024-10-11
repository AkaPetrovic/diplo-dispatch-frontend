"use client";

import DialogModal from "@/app/components/DialogModal";
import InputField from "@/app/components/InputField";
import Driver from "@/app/types/Driver";
import Truck from "@/app/types/Truck";
import { getTokenClientSide } from "@/app/utility/auth";
import {
  generateDefaultDriver,
  generateDefaultTruck,
} from "@/app/utility/default-value-generation";
import { hasMoreThanNSlashes } from "@/app/utility/helper";
import { isValidDate } from "@/app/utility/validation";
import { useEffect, useState } from "react";

const AddDriverPage = () => {
  const [trucks, setTrucks] = useState<Truck[]>();

  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [dialogModalType, setDialogModalType] = useState<"message" | "confirm">(
    "message",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [driverData, setDriverData] = useState<Driver>(() =>
    generateDefaultDriver(),
  );
  const [selectedTruckId, setSelectedTruckId] = useState(0);

  //Getting the trucks
  useEffect(() => {
    const getTrucks = async () => {
      const token = getTokenClientSide();

      const resTrucks = await fetch("http://localhost:8080/api/trucks", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const trucksData = await resTrucks.json();
      setTrucks(trucksData);
    };

    getTrucks();
  }, []);

  //Updating the truck after the trucks have loaded
  useEffect(() => {
    if (trucks && trucks.length > 0) {
      setDriverData((prevData) => ({
        ...prevData,
        truck: trucks[0], // Default to the first truck
      }));

      if (trucks[0].id) {
        setSelectedTruckId(trucks[0].id);
      }
    }
  }, [trucks]);

  //For handling truck change
  useEffect(() => {
    const truckById = trucks?.find((truck) => truck.id === selectedTruckId);

    //If a truck has been found by the find() function
    if (truckById) {
      setDriverData((prevData) => ({
        ...prevData,
        truck: truckById,
      }));
    }
  }, [selectedTruckId]);

  useEffect(() => {
    setErrorMessage("");

    if (
      driverData.name !== "" &&
      driverData.surname !== "" &&
      driverData.birthdate.length === 10
    ) {
      setIsSaveButtonDisabled(false);
    } else {
      setIsSaveButtonDisabled(true);
    }
  }, [driverData]);

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "birthdate") {
      // Allow only digits and slashes
      let formattedValue = value.replace(/[^\d/]/g, "");

      if (hasMoreThanNSlashes(formattedValue, 2)) {
        return;
      }

      if (formattedValue.length > 10) {
        return;
      }

      const stateSplit = driverData.birthdate.split("/");
      const split = formattedValue.split("/");

      if (stateSplit.length === 3 && split.length === 2) {
        if (
          (stateSplit[1] === "" && stateSplit[2] !== "") ||
          (stateSplit[0] === "" &&
            (stateSplit[1] !== "" || stateSplit[2] !== ""))
        ) {
          return;
        }
      } else if (stateSplit.length === 2 && split.length === 1) {
        if (stateSplit[0] === "" && stateSplit[1] !== "") {
          return;
        }
      }

      switch (split.length) {
        case 1:
          if (split[0].length > 2) {
            split[1] = split[0].substring(2);
            split[0] = split[0].substring(0, 2);
            formattedValue = split[0] + "/" + split[1];
          }
          break;
        case 2:
          if (split[0].length > 2) {
            return;
          }
          if (split[1].length > 2) {
            split[2] = split[1].substring(2);
            split[1] = split[1].substring(0, 2);
            formattedValue = split[0] + "/" + split[1] + "/" + split[2];
          }
          break;
        case 3:
          if (split[0].length > 2) {
            return;
          }
          if (split[1].length > 2) {
            return;
          }
          if (split[2].length > 4) {
            split[2] = split[2].substring(0, 4);
            formattedValue = split[0] + "/" + split[1] + "/" + split[2];
          }
          break;
      }

      setDriverData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      if (/^[A-Za-z]*$/.test(value) || value === "")
        setDriverData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    }
  };

  const validateInput = () => {
    if (!isValidDate(driverData.birthdate)) {
      setErrorMessage("Birthdate is not a valid date");
      return false;
    }
    if (Number(driverData.birthdate.split("/")[2]) < 1900) {
      setErrorMessage(
        "Birthdate year is less than 1900 which is considered invalid",
      );
      return false;
    }
    return true;
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInput()) return;

    const birthdate = driverData.birthdate;

    const [day, month, year] = birthdate.split("/");
    const birthdateFormatted = year + "-" + month + "-" + day;

    try {
      setDriverData({
        name: "",
        surname: "",
        birthdate: "",
        truck: trucks ? trucks[0] : generateDefaultTruck(),
      });
      setSelectedTruckId(trucks && trucks[0].id ? trucks[0].id : 0);
      setIsSaveButtonDisabled(true);

      const token = getTokenClientSide();

      const response = await fetch("http://localhost:8080/api/drivers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ ...driverData, birthdate: birthdateFormatted }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.text();

      setDialogModalType("message");
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
          <h1 className="mb-2">Add new driver</h1>
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
              <span className="label-text">Truck*</span>
            </div>
            <select
              id="truck"
              name="truck"
              value={selectedTruckId}
              onChange={(e) => setSelectedTruckId(Number(e.target.value))}
              className="select select-bordered"
            >
              {trucks?.map((truck) => (
                <option key={truck.id} value={truck.id}>
                  {`${truck.id} | ${truck.manufacturer.name} ${truck.model}`}
                </option>
              ))}
            </select>
          </label>

          <InputField
            id="name"
            name="name"
            type="text"
            value={driverData.name}
            label="Name*"
            autoComplete="off"
            onChange={handleInputChange}
          />
          <InputField
            id="surname"
            name="surname"
            type="text"
            value={driverData.surname}
            label="Surname*"
            autoComplete="off"
            onChange={handleInputChange}
          />
          <InputField
            id="birthdate"
            name="birthdate"
            type="text"
            value={driverData.birthdate}
            label="Birthdate*"
            autoComplete="off"
            placeholder="DD/MM/YYYY"
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={isSaveButtonDisabled}
            className="btn btn-neutral mt-10 w-full max-w-xs self-center rounded-full"
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
        type={dialogModalType}
      />
    </main>
  );
};

export default AddDriverPage;
