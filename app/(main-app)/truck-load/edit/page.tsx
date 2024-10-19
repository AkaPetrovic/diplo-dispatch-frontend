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
  generateDefaultLoadItem,
  generateDefaultTruckLoad,
} from "@/app/utility/default-value-generation";
import { hasMoreThanNSlashes, removeLeadingZeros } from "@/app/utility/helper";
import { isValidDate, isValidTime } from "@/app/utility/validation";
import { useEffect, useState } from "react";

const EditTruckLoadPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>();

  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [dialogModalType, setDialogModalType] = useState<"message" | "confirm">(
    "message",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [truckLoadData, setTruckLoadData] = useState<TruckLoad>(() =>
    generateDefaultTruckLoad(),
  );
  const [selectedDriverId, setSelectedDriverId] = useState(0);

  const [loadItems, setLoadItems] = useState<LoadItem[]>([]);
  const [selectedTableRowLoadItem, setSelectedTableRowLoadItem] =
    useState<number>(-1);
  const [selectedLoadItem, setSelectedLoadItem] = useState<LoadItem | null>(
    null,
  );

  const [loadItemData, setLoadItemData] = useState<LoadItem>(() =>
    generateDefaultLoadItem(),
  );

  const [truckLoadDateForSearch, setTruckLoadDateForSearch] = useState("");
  const [loadedTruckLoads, setLoadedTruckLoads] = useState<TruckLoad[]>();
  const [selectedTruckLoad, setSelectedTruckLoad] = useState<TruckLoad | null>(
    null,
  );
  const [selectedTableRowTruckLoad, setSelectedTableRowTruckLoad] =
    useState<number>(-1);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

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

      if (drivers[0].id) {
        setSelectedDriverId(drivers[0].id);
      }
    }
  }, [drivers]);

  //For handling driver change
  useEffect(() => {
    const driverById = drivers?.find(
      (driver) => driver.id === selectedDriverId,
    );

    //If a driver has been found by the find() function
    if (driverById) {
      setTruckLoadData((prevData) => ({
        ...prevData,
        driver: driverById,
      }));
    }
  }, [selectedDriverId]);

  useEffect(() => {
    setErrorMessage("");

    if (
      truckLoadData.startDate.length === 10 &&
      truckLoadData.endDate.length === 10 &&
      truckLoadData.startTime.length === 5 &&
      truckLoadData.endTime.length === 5
    ) {
      setIsSaveButtonDisabled(false);
    } else {
      setIsSaveButtonDisabled(true);
    }
  }, [truckLoadData]);

  const handleRemoveLoadItem = () => {
    if (selectedLoadItem === null || selectedTableRowLoadItem === -1) {
      return;
    }

    const newLoadItems = loadItems.filter(
      (item) => item.tableRow !== selectedLoadItem.tableRow,
    );

    const updatedLoadItems = newLoadItems.map((item, index) => ({
      ...item,
      tableRow: index,
    }));

    setLoadItems(updatedLoadItems);
    setSelectedLoadItem(null);
    setSelectedTableRowLoadItem(-1);
  };

  const handleAddNewLoadItem = () => {
    loadItemData.tableRow = loadItems.length;
    const newLoadItems = [...loadItems, loadItemData];
    setLoadItems(newLoadItems);
    setLoadItemData(() => generateDefaultLoadItem());
  };

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);
  };

  const handleRowClickLoadItem = (rowIndex: number) => {
    const loadItemByTableRowNumber = loadItems.find(
      (item) => item.tableRow === rowIndex,
    );
    if (loadItemByTableRowNumber) {
      setSelectedLoadItem(loadItemByTableRowNumber);
      setSelectedTableRowLoadItem(rowIndex);
    }
  };

  const handleRowClickTruckLoad = (truckLoadId: number, rowIndex: number) => {
    const truckLoadById = loadedTruckLoads?.find(
      (load) => load.id === truckLoadId,
    );
    if (truckLoadById) {
      setSelectedTruckLoad(truckLoadById);
      setSelectedTableRowTruckLoad(rowIndex);
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
        setSelectedTableRowTruckLoad(-1);
        setSelectedLoadItem(null);
        setSelectedTableRowLoadItem(-1);
        setTruckLoadData({
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
          incomePerKilometer: 0,
          driver: drivers ? drivers[0] : generateDefaultDriver(),
        });
        setLoadItemData(() => generateDefaultLoadItem());
        setLoadItems([]);
        setIsSaveButtonDisabled(true);
        setSelectedDriverId(drivers[0].id ? drivers[0].id : 0);
        setIsFormDisabled(true);

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
      if (selectedTruckLoad.driver.id) {
        setSelectedDriverId(selectedTruckLoad.driver.id);
      }

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

      setIsFormDisabled(false);

      setDialogModalType("message");
      setDialogModalMessage(
        "The form has been populated with truck load's data.",
      );
      setIsDialogOpen(true);
    }
  };

  const handleTruckLoadDataInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "incomePerKilometer") {
      if (value === "") {
        setTruckLoadData((prevData) => ({
          ...prevData,
          [name]: 0,
        }));
      }
    }

    if (name === "startDate" || name === "endDate") {
      // Allow only digits and slashes
      let formattedValue = value.replace(/[^\d/]/g, "");

      if (hasMoreThanNSlashes(formattedValue, 2)) {
        return;
      }

      if (formattedValue.length > 10) {
        return;
      }

      const stateSplit = truckLoadData[name].split("/");
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

      setTruckLoadData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else if (name === "startTime" || name === "endTime") {
      // Allow only digits and colons
      let formattedValue = value.replace(/[^\d:]/g, "");

      if (formattedValue.length > 5) {
        return;
      }

      const stateSplit = truckLoadData[name].split(":");
      const split = formattedValue.split(":");

      if (stateSplit.length === 2 && split.length === 1) {
        if (stateSplit[0] === "" && stateSplit[1] !== "") {
          return;
        }
      }

      switch (split.length) {
        case 1:
          if (split[0].length > 2) {
            split[1] = split[0].substring(2);
            split[0] = split[0].substring(0, 2);
            formattedValue = split[0] + ":" + split[1];
          }
          break;
        case 2:
          if (split[0].length > 2) {
            return;
          }
          if (split[1].length > 2) {
            split[1] = split[1].substring(0, 2);
            formattedValue = split[0] + ":" + split[1];
          }
          break;
      }

      setTruckLoadData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      if (/^\d(\.\d{1,2})?$/.test(value)) {
        setTruckLoadData((prevData) => ({
          ...prevData,
          [name]: Number(value),
        }));
      }
    }
  };

  const handleLoadItemDataInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "weight" || name === "volume") {
      if (value === "") {
        setLoadItemData((prevData) => ({
          ...prevData,
          [name]: 0,
        }));
      }
    }

    if (name === "weight") {
      if (/^\d{1,4}(\.\d{1,2})?$/.test(value)) {
        setLoadItemData((prevData) => ({
          ...prevData,
          [name]: Number(value),
        }));
      }
    } else if (name === "volume") {
      if (/^\d{1,2}(\.\d{1,2})?$/.test(value)) {
        setLoadItemData((prevData) => ({
          ...prevData,
          [name]: Number(value),
        }));
      }
    } else if (name === "dangerous" || name === "fragile") {
      setLoadItemData((prevData) => ({
        ...prevData,
        [name]: !prevData[name],
      }));
    } else {
      if (/^[A-Za-z]*$/.test(value)) {
        setLoadItemData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const validateInput = () => {
    if (!isValidDate(truckLoadData.startDate)) {
      setErrorMessage("Start date is not a valid date");
      return false;
    }
    if (!isValidDate(truckLoadData.endDate)) {
      setErrorMessage("End date is not a valid date");
      return false;
    }

    if (!isValidTime(truckLoadData.startTime)) {
      setErrorMessage("Start time is not valid.");
      return false;
    }
    if (!isValidTime(truckLoadData.endTime)) {
      setErrorMessage("End time is not valid.");
      return false;
    }

    const [startDay, startMonth, startYear] =
      truckLoadData.startDate.split("/");
    const [endDay, endMonth, endYear] = truckLoadData.endDate.split("/");

    const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
    const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);

    if (endDate < startDate) {
      setErrorMessage("End date cannot be before start date");
      return false;
    }

    if (startDate.getTime() === endDate.getTime()) {
      const [startHour, startMinute] = truckLoadData.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = truckLoadData.endTime.split(":").map(Number);

      if (
        endHour < startHour ||
        (endHour === startHour && endMinute <= startMinute)
      ) {
        setErrorMessage(
          "End time must be after start time when the dates are the same",
        );
        return false;
      }
    }

    return true;
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInput()) return;

    const { startDate, endDate } = truckLoadData;

    const [startDateDay, startDateMonth, startDateYear] = startDate.split("/");
    const startDateFormatted =
      startDateYear + "-" + startDateMonth + "-" + startDateDay;
    const [endDateDay, endDateMonth, endDateYear] = endDate.split("/");
    const endDateFormatted =
      endDateYear + "-" + endDateMonth + "-" + endDateDay;

    try {
      setTruckLoadData({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        incomePerKilometer: 0,
        driver: drivers ? drivers[0] : generateDefaultDriver(),
      });
      setSelectedDriverId(drivers && drivers[0].id ? drivers[0].id : 0);
      setLoadItems([]);
      setLoadItemData(() => generateDefaultLoadItem());
      setTruckLoadDateForSearch("");
      setLoadedTruckLoads([]);
      setSelectedTruckLoad(null);
      setSelectedTableRowTruckLoad(-1);
      setSelectedLoadItem(null);
      setSelectedTableRowTruckLoad(-1);
      setIsFormDisabled(true);
      setIsSaveButtonDisabled(true);

      const token = getTokenClientSide();

      const request = {
        truckLoad: {
          ...truckLoadData,
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
        loadItems: loadItems,
      };

      const response = await fetch("http://localhost:8080/api/loads/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(request),
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
      <div className="w-1/2 min-w-fit px-8 py-5 shadow">
        <div className="flex flex-col">
          <h1 className="mb-2">Edit truck load</h1>
          <p className="w-full max-w-xs text-sm">
            Fields marked with * are required
          </p>
          {errorMessage ? (
            <p className="w-full max-w-xs text-red-500">{errorMessage}</p>
          ) : null}
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
                    className={`${index === selectedTableRowTruckLoad ? "bg-primary text-primary-content" : ""} cursor-pointer`}
                    onClick={() =>
                      handleRowClickTruckLoad(load.id ? load.id : 0, index)
                    }
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
          disabled={selectedTableRowTruckLoad === -1}
          onClick={handleChooseTruckLoad}
        >
          Choose
        </button>

        <hr />

        <form onSubmit={handleUpdate} className="mt-7 flex flex-col gap-3">
          <div className="flex">
            <div className="mr-3 w-1/2">
              <h2>Truck load data</h2>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Driver*</span>
                </div>
                <select
                  id="driver"
                  name="driver"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(Number(e.target.value))}
                  className="select select-bordered"
                  disabled={isFormDisabled}
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
                  label="Departure date*"
                  autoComplete="off"
                  placeholder="DD/MM/YYYY"
                  onChange={handleTruckLoadDataInputChange}
                  disabled={isFormDisabled}
                />
                <InputField
                  id="endDate"
                  name="endDate"
                  type="text"
                  value={truckLoadData.endDate}
                  label="Arrival date*"
                  autoComplete="off"
                  placeholder="DD/MM/YYYY"
                  onChange={handleTruckLoadDataInputChange}
                  disabled={isFormDisabled}
                />
              </div>

              <div className="flex gap-3">
                <InputField
                  id="startTime"
                  name="startTime"
                  type="text"
                  value={truckLoadData.startTime}
                  label="Departure time*"
                  autoComplete="off"
                  placeholder="hh:mm"
                  onChange={handleTruckLoadDataInputChange}
                  disabled={isFormDisabled}
                />
                <InputField
                  id="endTime"
                  name="endTime"
                  type="text"
                  value={truckLoadData.endTime}
                  label="Arrival time*"
                  autoComplete="off"
                  placeholder="hh:mm"
                  onChange={handleTruckLoadDataInputChange}
                  disabled={isFormDisabled}
                />
              </div>

              <InputField
                id="incomePerKilometer"
                name="incomePerKilometer"
                type="number"
                value={truckLoadData.incomePerKilometer}
                label="Income per kilometer*"
                autoComplete="off"
                onChange={handleTruckLoadDataInputChange}
                onInput={removeLeadingZeros}
                disabled={isFormDisabled}
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
                          <tr
                            key={index}
                            className={`${index === selectedTableRowLoadItem ? "bg-primary text-primary-content" : ""} cursor-pointer`}
                            onClick={() => handleRowClickLoadItem(index)}
                          >
                            <td>
                              {item.tableRow !== undefined
                                ? item.tableRow + 1
                                : ""}
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
                <button
                  type="button"
                  className="btn btn-neutral mt-3 self-end rounded-full px-8"
                  disabled={selectedLoadItem === null}
                  onClick={handleRemoveLoadItem}
                >
                  Remove item
                </button>
              </div>
            </div>

            <div className="ml-3 flex w-1/2 flex-col">
              <h2>New load item</h2>
              <InputField
                id="name"
                name="name"
                type="text"
                value={loadItemData.name}
                label="Item name*"
                autoComplete="off"
                onChange={handleLoadItemDataInputChange}
                disabled={isFormDisabled}
              />

              <div>
                <label className="label inline-flex cursor-pointer gap-3">
                  <span className="label-text">Dangerous</span>
                  <input
                    name="dangerous"
                    type="checkbox"
                    onChange={handleLoadItemDataInputChange}
                    checked={loadItemData.dangerous}
                    className="checkbox"
                    disabled={isFormDisabled}
                  />
                </label>
              </div>

              <div>
                <label className="label inline-flex cursor-pointer gap-3">
                  <span className="label-text">Fragile</span>
                  <input
                    name="fragile"
                    type="checkbox"
                    onChange={handleLoadItemDataInputChange}
                    checked={loadItemData.fragile}
                    className="checkbox"
                    disabled={isFormDisabled}
                  />
                </label>
              </div>

              <InputField
                id="weight"
                name="weight"
                type="number"
                value={loadItemData.weight}
                label="Weight*"
                autoComplete="off"
                onChange={handleLoadItemDataInputChange}
                onInput={removeLeadingZeros}
                disabled={isFormDisabled}
              />
              <InputField
                id="volume"
                name="volume"
                type="number"
                value={loadItemData.volume}
                label="Volume*"
                autoComplete="off"
                onChange={handleLoadItemDataInputChange}
                onInput={removeLeadingZeros}
                disabled={isFormDisabled}
              />

              <button
                type="button"
                className="btn btn-neutral mt-3 self-end rounded-full px-8"
                disabled={loadItemData.name === ""}
                onClick={handleAddNewLoadItem}
              >
                Add item
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSaveButtonDisabled}
            className="btn btn-neutral mt-8 w-full max-w-xs self-center rounded-full"
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

export default EditTruckLoadPage;
