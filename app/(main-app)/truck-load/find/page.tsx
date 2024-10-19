"use client";

import DialogModal from "@/app/components/DialogModal";
import InputField from "@/app/components/InputField";
import Driver from "@/app/types/Driver";
import ErrorMessage from "@/app/types/ErrorMessage";
import LoadItem from "@/app/types/LoadItem";
import TruckLoad from "@/app/types/TruckLoad";
import { getTokenClientSide } from "@/app/utility/auth";
import {
  generateDefaultDriver,
  generateDefaultTruckLoad,
} from "@/app/utility/default-value-generation";
import { hasMoreThanNSlashes } from "@/app/utility/helper";
import { isValidDate } from "@/app/utility/validation";
import { useEffect, useState } from "react";

const FindTruckLoadPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>();

  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [dialogModalType, setDialogModalType] = useState<"message" | "confirm">(
    "message",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [truckLoadData, setTruckLoadData] = useState<TruckLoad>(() =>
    generateDefaultTruckLoad(),
  );

  const [loadItems, setLoadItems] = useState<LoadItem[]>([]);

  const [truckLoadDateForSearch, setTruckLoadDateForSearch] = useState("");
  const [loadedTruckLoads, setLoadedTruckLoads] = useState<TruckLoad[]>();
  const [selectedTruckLoad, setSelectedTruckLoad] = useState<TruckLoad | null>(
    null,
  );
  const [selectedTableRow, setSelectedTableRow] = useState<number>(-1);

  //Getting the drivers
  useEffect(() => {
    const getDrivers = async () => {
      const token = getTokenClientSide();

      const resDrivers = await fetch("http://localhost:8080/api/drivers", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const driversData = await resDrivers.json();
      setDrivers(driversData);
    };

    getDrivers();
  }, []);

  //Updating the truck after the trucks have loaded
  useEffect(() => {
    if (drivers && drivers.length > 0) {
      setTruckLoadData((prevData) => ({
        ...prevData,
        driver: drivers[0], // Default to the first driver
      }));
    }
  }, [drivers]);

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);
  };

  const handleRowClick = (truckLoadId: number, rowIndex: number) => {
    const truckLoadById = loadedTruckLoads?.find(
      (load) => load.id === truckLoadId,
    );
    if (truckLoadById) {
      setSelectedTruckLoad(truckLoadById);
      setSelectedTableRow(rowIndex);
    }
  };

  const handleTruckLoadDateForSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;

    // Allow only digits and slashes
    let formattedValue = value.replace(/[^\d/]/g, "");

    if (hasMoreThanNSlashes(formattedValue, 2)) {
      return;
    }

    if (formattedValue.length > 10) {
      return;
    }

    const stateSplit = truckLoadDateForSearch.split("/");
    const split = formattedValue.split("/");

    if (stateSplit.length === 3 && split.length === 2) {
      if (
        (stateSplit[1] === "" && stateSplit[2] !== "") ||
        (stateSplit[0] === "" && (stateSplit[1] !== "" || stateSplit[2] !== ""))
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

    setTruckLoadDateForSearch(formattedValue);
  };

  const handleLoadTruckLoads = async () => {
    if (!isValidDate(truckLoadDateForSearch)) return;

    if (drivers) {
      try {
        setSelectedTruckLoad(null);
        setSelectedTableRow(-1);
        setTruckLoadData({
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
          incomePerKilometer: 0,
          driver: drivers ? drivers[0] : generateDefaultDriver(),
        });
        setLoadItems([]);

        const token = getTokenClientSide();

        const [day, month, year] = truckLoadDateForSearch.split("/");

        const truckLoadDateForSearchFormatted = year + "-" + month + "-" + day;

        const resTruckLoadsByDate = await fetch(
          `http://localhost:8080/api/loads/getByStartDate?date=${truckLoadDateForSearchFormatted}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        if (!resTruckLoadsByDate.ok) {
          const error: ErrorMessage = await resTruckLoadsByDate.json();
          throw new Error(error.body.detail);
        }

        const loadedTruckLoadsData: TruckLoad[] =
          await resTruckLoadsByDate.json();

        loadedTruckLoadsData.map((load) => {
          const [startDateYear, startDateMonth, startDateDay] =
            load.startDate.split("-");
          const [endDateYear, endDateMonth, endDateDay] =
            load.endDate.split("-");
          const startDayFormatted =
            startDateDay + "/" + startDateMonth + "/" + startDateYear;
          const endDayFormatted =
            endDateDay + "/" + endDateMonth + "/" + endDateYear;

          load.startDate = startDayFormatted;
          load.endDate = endDayFormatted;
          load.startTime = load.startTime.substring(0, 5);
          load.endTime = load.endTime.substring(0, 5);
        });

        setLoadedTruckLoads(loadedTruckLoadsData);

        setDialogModalType("message");
        setDialogModalMessage("Truck loads have been found in the database.");
        setIsDialogOpen(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setLoadedTruckLoads([]);

          setDialogModalType("message");
          setDialogModalMessage(error.message);
          setIsDialogOpen(true);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const handleChooseTruckLoad = async () => {
    if (selectedTruckLoad) {
      setTruckLoadData(selectedTruckLoad);

      const token = getTokenClientSide();
      const resLoadItemsByTruckLoadId = await fetch(
        `http://localhost:8080/api/loads/${selectedTruckLoad.id}/items`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );
      if (!resLoadItemsByTruckLoadId.ok) {
        const error: ErrorMessage = await resLoadItemsByTruckLoadId.json();
        throw new Error(error.body.detail);
      }

      const loadItemsData: LoadItem[] = await resLoadItemsByTruckLoadId.json();
      loadItemsData.map((item, index) => {
        item.tableRow = index;
      });
      setLoadItems(loadItemsData);

      setDialogModalType("message");
      setDialogModalMessage(
        "The form has been populated with truck load's data.",
      );
      setIsDialogOpen(true);
    }
  };

  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-1/4 min-w-fit px-8 py-5 shadow">
        <div className="flex flex-col">
          <h1 className="mb-2">Find truck load</h1>
        </div>

        <div className="mb-4 flex flex-row items-end gap-4">
          <InputField
            id="truckLoadDateForSearch"
            name="truckLoadDateForSearch"
            type="text"
            value={truckLoadDateForSearch}
            label="Search for truck loads by departure date"
            autoComplete="off"
            onChange={handleTruckLoadDateForSearchChange}
          />
          <button
            type="button"
            className="btn btn-neutral rounded-full px-8"
            onClick={handleLoadTruckLoads}
            disabled={truckLoadDateForSearch.length !== 10}
          >
            Load truck loads
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th>ID</th>
                <th>Departure date</th>
                <th>Arrival date</th>
                <th>Departure time</th>
                <th>Arrival time</th>
                <th>Income per kilometer</th>
                <th>Driver</th>
              </tr>
            </thead>
            {loadedTruckLoads && loadedTruckLoads.length > 0 ? (
              <tbody>
                {loadedTruckLoads.map((load, index) => (
                  <tr
                    key={load.id}
                    className={`${index === selectedTableRow ? "bg-primary text-primary-content" : ""} cursor-pointer`}
                    onClick={() => handleRowClick(load.id ? load.id : 0, index)}
                  >
                    <th>{load.id}</th>
                    <td>{load.startDate}</td>
                    <td>{load.endDate}</td>
                    <td>{load.startTime}</td>
                    <td>{load.endTime}</td>
                    <td>{load.incomePerKilometer}</td>
                    <td>{`${load.driver.name} ${load.driver.surname}`}</td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
        </div>

        <button
          type="button"
          className="btn btn-neutral mb-7 mt-3 rounded-full px-8"
          disabled={selectedTableRow === -1}
          onClick={handleChooseTruckLoad}
        >
          Choose
        </button>

        <hr />

        <form className="mt-7 flex flex-col gap-3">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Driver</span>
            </div>
            <select
              id="driver"
              name="driver"
              value={truckLoadData.driver.id}
              className="select select-bordered"
              disabled={true}
            >
              {drivers?.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {`${driver.id} | ${driver.name} ${driver.surname}`}
                </option>
              ))}
            </select>
          </label>

          <InputField
            id="id"
            name="id"
            type="text"
            value={truckLoadData.id ? truckLoadData.id : ""}
            label="ID"
            disabled={true}
          />

          <div className="flex gap-3">
            <InputField
              id="startDate"
              name="startDate"
              type="text"
              value={truckLoadData.startDate}
              label="Departure date"
              autoComplete="off"
              placeholder="DD/MM/YYYY"
              disabled={true}
            />
            <InputField
              id="endDate"
              name="endDate"
              type="text"
              value={truckLoadData.endDate}
              label="Arrival date"
              autoComplete="off"
              placeholder="DD/MM/YYYY"
              disabled={true}
            />
          </div>

          <div className="flex gap-3">
            <InputField
              id="startTime"
              name="startTime"
              type="text"
              value={truckLoadData.startTime}
              label="Departure time"
              autoComplete="off"
              placeholder="hh:mm"
              disabled={true}
            />
            <InputField
              id="endTime"
              name="endTime"
              type="text"
              value={truckLoadData.endTime}
              label="Arrival time"
              autoComplete="off"
              placeholder="hh:mm"
              disabled={true}
            />
          </div>

          <InputField
            id="incomePerKilometer"
            name="incomePerKilometer"
            type="number"
            value={truckLoadData.incomePerKilometer}
            label="Income per kilometer"
            autoComplete="off"
            disabled={true}
          />

          <div className="flex flex-col">
            <span className="mt-4 px-1 py-2 text-sm">Load items:</span>
            <div className="max-h-[11rem] overflow-x-auto">
              <table className="table table-pin-rows table-xs">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Name</th>
                    <th>Dangerous</th>
                    <th>Fragile</th>
                    <th>Weight (kg)</th>
                    <th>Volume (m&sup3;)</th>
                  </tr>
                </thead>
                {loadItems.length > 0 ? (
                  <tbody>
                    {loadItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.tableRow !== undefined ? item.tableRow + 1 : ""}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.dangerous ? "Yes" : "No"}</td>
                        <td>{item.fragile ? "Yes" : "No"}</td>
                        <td>{item.weight}</td>
                        <td>{item.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                ) : null}
              </table>
            </div>
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

export default FindTruckLoadPage;
