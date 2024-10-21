"use client";

import DialogModal from "@/app/components/DialogModal";
import InputField from "@/app/components/InputField";
import ErrorMessage from "@/app/types/ErrorMessage";
import Manufacturer from "@/app/types/Manufacturer";
import Truck from "@/app/types/Truck";
import { useEffect, useState } from "react";

const FindTruckPage = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>();

  const [selectedManufacturerIdForSearch, setSelectedManufacturerIdForSearch] =
    useState(0);

  const [loadedTrucks, setLoadedTrucks] = useState<Truck[]>();
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);

  const [selectedTableRow, setSelectedTableRow] = useState<number>(-1);

  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [dialogModalType, setDialogModalType] = useState<"message" | "confirm">(
    "message",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [truckData, setTruckData] = useState<Truck>({
    model: "",
    power: 0,
    kilometersTravelled: 0,
    year: 0,
    carryingCapacity: 0,
    manufacturer: { id: 0, name: "" }, //temporary value until the manufacturers are loaded
  });

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
      setSelectedManufacturerIdForSearch(manufacturers[0].id);
      setTruckData((prevData) => ({
        ...prevData,
        manufacturer: manufacturers[0], // Default to the first manufacturer
      }));
    }
  }, [manufacturers]);

  const handleRowClick = (truckId: number, rowIndex: number) => {
    const truckById = loadedTrucks?.find((truck) => truck.id === truckId);
    if (truckById) {
      setSelectedTruck(truckById);
      setSelectedTableRow(rowIndex);
    }
  };

  const handleLoadTrucks = async () => {
    if (manufacturers) {
      try {
        setSelectedTruck(null);
        setSelectedTableRow(-1);
        setTruckData({
          model: "",
          power: 0,
          kilometersTravelled: 0,
          year: 0,
          carryingCapacity: 0,
          manufacturer: manufacturers[0],
        });

        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        const resTrucksByManufacturer = await fetch(
          `http://localhost:8080/api/trucks/manufacturer/${selectedManufacturerIdForSearch}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        if (!resTrucksByManufacturer.ok) {
          const error: ErrorMessage = await resTrucksByManufacturer.json();
          throw new Error(error.body.detail);
        }

        const loadedTrucksData = await resTrucksByManufacturer.json();
        setLoadedTrucks(loadedTrucksData);

        setDialogModalType("message");
        setDialogModalMessage("Trucks have been found in the database.");
        setIsDialogOpen(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setLoadedTrucks([]);

          setDialogModalType("message");
          setDialogModalMessage(error.message);
          setIsDialogOpen(true);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const handleChooseTruck = () => {
    if (selectedTruck) {
      setTruckData(selectedTruck);

      setDialogModalType("message");
      setDialogModalMessage("The form has been populated with truck data.");
      setIsDialogOpen(true);
    }
  };

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-1/4 min-w-fit px-6 py-3 shadow 3xl:px-8 3xl:py-5">
        <div className="flex flex-col">
          <h1>Find truck</h1>
        </div>

        <div className="mb-2 flex flex-row items-end gap-4">
          <label className="form-control w-full max-w-xs">
            <div className="label px-1 pb-1 pt-2 3xl:py-2">
              <span className="label-text">Select the truck manufacturer</span>
            </div>
            <select
              id="manufacturer"
              name="manufacturer"
              value={selectedManufacturerIdForSearch}
              onChange={(e) =>
                setSelectedManufacturerIdForSearch(Number(e.target.value))
              }
              className="select select-bordered h-10 min-h-10 3xl:h-12 3xl:min-h-12"
            >
              {manufacturers?.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn btn-neutral h-10 min-h-10 rounded-full px-8 3xl:h-12 3xl:min-h-12"
            onClick={handleLoadTrucks}
          >
            Load trucks
          </button>
        </div>

        <div className="max-h-24 overflow-x-auto">
          <table className="table table-pin-rows table-xs">
            <thead>
              <tr>
                <th>ID</th>
                <th>Manufacturer</th>
                <th>Model</th>
                <th>Power</th>
                <th>Kilometers travelled</th>
                <th>Year</th>
                <th>Carrying capacity</th>
              </tr>
            </thead>
            {loadedTrucks && loadedTrucks.length > 0 ? (
              <tbody>
                {loadedTrucks.map((truck, index) => (
                  <tr
                    key={truck.id}
                    className={`${index === selectedTableRow ? "bg-primary text-primary-content" : ""} cursor-pointer`}
                    onClick={() =>
                      handleRowClick(truck.id ? truck.id : 0, index)
                    }
                  >
                    <th>{truck.id}</th>
                    <td>{truck.manufacturer.name}</td>
                    <td>{truck.model}</td>
                    <td>{truck.power}HP</td>
                    <td>{truck.kilometersTravelled}km</td>
                    <td>{truck.year}</td>
                    <td>{truck.carryingCapacity}</td>
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
          onClick={handleChooseTruck}
        >
          Choose
        </button>

        <hr />

        <form className="flex flex-col 3xl:mt-7 3xl:gap-3">
          <InputField
            id="model"
            name="model"
            type="text"
            value={truckData.id ? truckData.id : ""}
            label="ID"
            disabled={true}
          />
          <label className="form-control w-full max-w-xs">
            <div className="label px-1 pb-1 pt-2 3xl:py-2">
              <span className="label-text">Manufacturer</span>
            </div>
            <select
              id="manufacturer"
              name="manufacturer"
              value={truckData.manufacturer.id}
              disabled={true}
              className="select select-bordered h-10 min-h-10 3xl:h-12 3xl:min-h-12"
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
            label="Model"
            autoComplete="off"
            disabled={true}
          />
          <div className="flex gap-4 3xl:flex-col 3xl:gap-3">
            <InputField
              id="power"
              name="power"
              type="number"
              value={truckData.power}
              label="Power (HP)"
              disabled={true}
            />
            <InputField
              id="kilometersTravelled"
              name="kilometersTravelled"
              type="number"
              value={truckData.kilometersTravelled}
              label="Kilometers travelled"
              disabled={true}
            />
          </div>
          <div className="flex gap-4 3xl:flex-col 3xl:gap-3">
            <InputField
              id="year"
              name="year"
              type="number"
              value={truckData.year}
              label="Year"
              disabled={true}
            />
            <InputField
              id="carryingCapacity"
              name="carryingCapacity"
              type="number"
              value={truckData.carryingCapacity}
              label="Carrying Capacity (tons)"
              disabled={true}
            />
          </div>
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

export default FindTruckPage;
