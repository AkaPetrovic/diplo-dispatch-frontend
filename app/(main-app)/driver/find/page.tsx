"use client";

import DialogModal from "@/app/components/DialogModal";
import InputField from "@/app/components/InputField";
import Driver from "@/app/types/Driver";
import ErrorMessage from "@/app/types/ErrorMessage";
import Manufacturer from "@/app/types/Manufacturer";
import Truck from "@/app/types/Truck";
import { getTokenClientSide } from "@/app/utility/auth";
import {
  generateDefaultDriver,
  generateDefaultTruck,
} from "@/app/utility/default-value-generation";
import { useEffect, useState } from "react";

const FindDriverPage = () => {
  const [trucks, setTrucks] = useState<Truck[]>();

  const [driverNameForSearch, setDriverNameForSearch] = useState("");

  const [loadedDrivers, setLoadedDrivers] = useState<Driver[]>();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [selectedTableRow, setSelectedTableRow] = useState<number>(-1);

  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [dialogModalType, setDialogModalType] = useState<"message" | "confirm">(
    "message",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [driverData, setDriverData] = useState<Driver>(() =>
    generateDefaultDriver(),
  );

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
    }
  }, [trucks]);

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

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-1/4 min-w-fit px-6 py-3 shadow 3xl:px-8 3xl:py-5">
        <div className="flex flex-col">
          <h1>Find driver</h1>
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

        <form className="flex flex-col 3xl:mt-7 3xl:gap-3">
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
              <span className="label-text">Truck</span>
            </div>
            <select
              id="truck"
              name="truck"
              value={driverData.truck.id}
              disabled={true}
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
            label="Name"
            autoComplete="off"
            disabled={true}
          />
          <InputField
            id="surname"
            name="surname"
            type="text"
            value={driverData.surname}
            label="Surname"
            autoComplete="off"
            disabled={true}
          />
          <InputField
            id="birthdate"
            name="birthdate"
            type="text"
            value={driverData.birthdate}
            label="Birthdate"
            autoComplete="off"
            disabled={true}
          />
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

export default FindDriverPage;
