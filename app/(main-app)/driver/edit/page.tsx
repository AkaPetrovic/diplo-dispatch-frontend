"use client";

import DialogModal from "@/app/components/DialogModal";
import InputField from "@/app/components/InputField";
import Driver from "@/app/types/Driver";
import ErrorMessage from "@/app/types/ErrorMessage";
import Truck from "@/app/types/Truck";
import { getTokenClientSide } from "@/app/utility/auth";
import {
  generateDefaultDriver,
  generateDefaultTruck,
} from "@/app/utility/default-value-generation";
import { hasMoreThanNSlashes } from "@/app/utility/helper";
import { isValidDate } from "@/app/utility/validation";
import { useEffect, useState } from "react";

const EditDriverPage = () => {
  const [trucks, setTrucks] = useState<Truck[]>();

  const [driverNameForSearch, setDriverNameForSearch] = useState("");

  const [loadedDrivers, setLoadedDrivers] = useState<Driver[]>();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const [selectedTableRow, setSelectedTableRow] = useState<number>(-1);
  const [errorMessage, setErrorMessage] = useState("");

  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [dialogModalType, setDialogModalType] = useState<"message" | "confirm">(
    "message",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleRowClick = (driverId: number, rowIndex: number) => {
    const driverById = loadedDrivers?.find((driver) => driver.id === driverId);
    if (driverById) {
      setSelectedDriver(driverById);
      setSelectedTableRow(rowIndex);
    }
  };

  const handleLoadDrivers = async () => {
    if (trucks) {
      try {
        setSelectedDriver(null);
        setSelectedTableRow(-1);
        setDriverData({
          name: "",
          surname: "",
          birthdate: "",
          truck: trucks ? trucks[0] : generateDefaultTruck(),
        });
        setIsSaveButtonDisabled(true);
        setSelectedTruckId(trucks[0].id ? trucks[0].id : 0);
        setIsFormDisabled(true);

        const token = getTokenClientSide();

        const resDriversByName = await fetch(
          `http://localhost:8080/api/drivers/getByName?name=${driverNameForSearch}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        if (!resDriversByName.ok) {
          const error: ErrorMessage = await resDriversByName.json();
          throw new Error(error.body.detail);
        }

        const loadedDriversData: Driver[] = await resDriversByName.json();

        loadedDriversData.map((driver) => {
          const birthdate = driver.birthdate;
          const [year, month, day] = birthdate.split("-");
          const birthdateFormatted = day + "/" + month + "/" + year;
          driver.birthdate = birthdateFormatted;
        });

        setLoadedDrivers(loadedDriversData);

        setDialogModalType("message");
        setDialogModalMessage("Drivers have been found in the database.");
        setIsDialogOpen(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setLoadedDrivers([]);

          setDialogModalType("message");
          setDialogModalMessage(error.message);
          setIsDialogOpen(true);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const handleChooseDriver = () => {
    if (selectedDriver) {
      setDriverData(selectedDriver);
      if (selectedDriver.truck.id) {
        setSelectedTruckId(selectedDriver.truck.id);
      }
      setIsFormDisabled(false);

      setDialogModalType("message");
      setDialogModalMessage("The form has been populated with driver's data.");
      setIsDialogOpen(true);
    }
  };

  const handleDriverNameForSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    if (/^[A-Za-z]*$/.test(value) || value === "") {
      setDriverNameForSearch(value);
    }
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

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);
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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInput()) return;

    const birthdate = driverData.birthdate;

    const [day, month, year] = birthdate.split("/");
    const birthdateFormatted = year + "-" + month + "-" + day;

    try {
      setDriverNameForSearch("");
      setLoadedDrivers([]);
      setSelectedDriver(null);
      setSelectedTableRow(-1);
      setDriverData({
        name: "",
        surname: "",
        birthdate: "",
        truck: trucks ? trucks[0] : generateDefaultTruck(),
      });
      setSelectedTruckId(trucks && trucks[0].id ? trucks[0].id : 0);
      setIsSaveButtonDisabled(true);
      setIsFormDisabled(true);

      const token = getTokenClientSide();

      const response = await fetch("http://localhost:8080/api/drivers/update", {
        method: "PUT",
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
      <div className="w-1/4 min-w-fit px-6 py-3 shadow 3xl:px-8 3xl:py-5">
        <div className="flex flex-col">
          <h1 className="mb-2">Edit driver</h1>
          <p className="w-full max-w-xs text-sm">
            Fields marked with * are required
          </p>
          {errorMessage ? (
            <p className="w-full max-w-xs text-red-500">{errorMessage}</p>
          ) : null}
        </div>

        <div className="mb-2 flex flex-row items-end gap-4">
          <InputField
            id="driverNameForSearch"
            name="driverNameForSearch"
            type="text"
            value={driverNameForSearch}
            label="Search for drivers by name"
            onChange={handleDriverNameForSearchChange}
          />
          <button
            type="button"
            className="btn btn-neutral h-10 min-h-10 rounded-full px-8 3xl:h-12 3xl:min-h-12"
            onClick={handleLoadDrivers}
          >
            Load drivers
          </button>
        </div>

        <div className="max-h-24 overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Birthdate</th>
                <th>Truck</th>
              </tr>
            </thead>
            {loadedDrivers && loadedDrivers.length > 0 ? (
              <tbody>
                {loadedDrivers.map((driver, index) => (
                  <tr
                    key={driver.id}
                    className={`${index === selectedTableRow ? "bg-primary text-primary-content" : ""} cursor-pointer`}
                    onClick={() =>
                      handleRowClick(driver.id ? driver.id : 0, index)
                    }
                  >
                    <th>{driver.id}</th>
                    <td>{driver.name}</td>
                    <td>{driver.surname}</td>
                    <td>{driver.birthdate}</td>
                    <td>{`${driver.truck.manufacturer.name} ${driver.truck.model}`}</td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
        </div>

        <button
          type="button"
          className="btn btn-neutral mb-2 mt-2 h-10 min-h-10 rounded-full px-8 3xl:mb-7 3xl:mt-3 3xl:h-12 3xl:min-h-12"
          disabled={selectedTableRow === -1}
          onClick={handleChooseDriver}
        >
          Choose
        </button>

        <hr />

        <form
          onSubmit={handleUpdate}
          className="flex flex-col 3xl:mt-7 3xl:gap-3"
        >
          <InputField
            id="id"
            name="id"
            type="text"
            value={driverData.id ? driverData.id : ""}
            label="ID"
            disabled={true}
          />
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Truck*</span>
            </div>
            <select
              id="truck"
              name="truck"
              value={selectedTruckId}
              onChange={(e) => setSelectedTruckId(Number(e.target.value))}
              disabled={isFormDisabled}
              className="select select-bordered h-10 min-h-10 3xl:h-12 3xl:min-h-12"
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
            disabled={isFormDisabled}
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
            disabled={isFormDisabled}
          />
          <InputField
            id="birthdate"
            name="birthdate"
            type="text"
            value={driverData.birthdate}
            label="Birthdate*"
            autoComplete="off"
            onChange={handleInputChange}
            disabled={isFormDisabled}
          />
          <button
            type="submit"
            disabled={isSaveButtonDisabled}
            className="btn btn-neutral mt-5 h-10 min-h-10 w-full max-w-72 self-center rounded-full 3xl:mt-10 3xl:h-12 3xl:min-h-12"
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

export default EditDriverPage;
