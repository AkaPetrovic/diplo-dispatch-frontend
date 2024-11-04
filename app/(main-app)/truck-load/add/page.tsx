"use client";

import DialogModal from "@/app/components/DialogModal";
import InputField from "@/app/components/InputField";
import TruckLoadPDF from "@/app/components/PDF/TruckLoadPDF";
import Driver from "@/app/types/Driver";
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
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

const AddTruckLoadPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>();

  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [dialogModalType, setDialogModalType] = useState<
    "message" | "confirm" | "pdf"
  >("message");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [truckLoadData, setTruckLoadData] = useState<TruckLoad>(() =>
    generateDefaultTruckLoad(),
  );
  const [selectedDriverId, setSelectedDriverId] = useState(0);

  const [loadItems, setLoadItems] = useState<LoadItem[]>([]);
  const [selectedTableRow, setSelectedTableRow] = useState<number>(-1);
  const [selectedLoadItem, setSelectedLoadItem] = useState<LoadItem | null>(
    null,
  );

  const [loadItemData, setLoadItemData] = useState<LoadItem>(() =>
    generateDefaultLoadItem(),
  );

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
    if (selectedLoadItem === null || selectedTableRow === -1) {
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
    setSelectedTableRow(-1);
  };

  const handleAddNewLoadItem = () => {
    loadItemData.tableRow = loadItems.length;
    const newLoadItems = [...loadItems, loadItemData];
    setLoadItems(newLoadItems);
    setLoadItemData(() => generateDefaultLoadItem());
  };

  const handleRowClick = (rowIndex: number) => {
    const loadItemByTableRowNumber = loadItems.find(
      (item) => item.tableRow === rowIndex,
    );
    if (loadItemByTableRowNumber) {
      setSelectedLoadItem(loadItemByTableRowNumber);
      setSelectedTableRow(rowIndex);
    }
  };

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogModalCloseWithFormReset = () => {
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
    setIsSaveButtonDisabled(true);

    setIsDialogOpen(false);
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
      setErrorMessage("Departure date is not a valid date");
      return false;
    }
    if (!isValidDate(truckLoadData.endDate)) {
      setErrorMessage("Arrival date is not a valid date");
      return false;
    }

    if (!isValidTime(truckLoadData.startTime)) {
      setErrorMessage("Departure time is not valid.");
      return false;
    }
    if (!isValidTime(truckLoadData.endTime)) {
      setErrorMessage("Arrival time is not valid.");
      return false;
    }

    // Convert the startDate and endDate to Date objects
    const [startDay, startMonth, startYear] =
      truckLoadData.startDate.split("/");
    const [endDay, endMonth, endYear] = truckLoadData.endDate.split("/");

    const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
    const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);

    if (endDate < startDate) {
      setErrorMessage("Arrival date cannot be before Departure date");
      return false;
    }

    // If the dates are the same, compare the times
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
          "Arrival time must be after departure time when the dates are the same",
        );
        return false;
      }
    }

    return true;
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const token = getTokenClientSide();

      const request = {
        truckLoad: {
          ...truckLoadData,
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
        loadItems: loadItems,
      };

      const response = await fetch("http://localhost:8080/api/loads/add", {
        method: "POST",
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

      setDialogModalType("pdf");
      setDialogModalMessage(result + " Do you want to download a PDF?");
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
      <div className="w-3/5 min-w-fit px-6 py-3 shadow 3xl:w-1/4 3xl:px-8 3xl:py-5">
        <div className="flex grow flex-col">
          <h1 className="mb-2">Add new truck load</h1>
          <p className="w-full max-w-xs text-sm">
            Fields marked with * are required
          </p>
          {errorMessage ? (
            <p className="w-full max-w-xs text-sm text-red-500">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <form
          onSubmit={handleSave}
          className="mt-2 flex flex-col 3xl:mt-7 3xl:gap-3"
        >
          <div className="flex 3xl:flex-col">
            <div className="w-3/5 border-r pr-3 3xl:mb-2 3xl:w-full 3xl:border-none 3xl:p-0">
              <label className="form-control w-full max-w-xs">
                <div className="label px-1 pb-1 pt-2 3xl:py-2">
                  <span className="label-text">Driver*</span>
                </div>
                <select
                  id="driver"
                  name="driver"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(Number(e.target.value))}
                  className="select select-bordered h-10 min-h-10 3xl:h-12 3xl:min-h-12"
                >
                  {drivers?.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {`${driver.id} | ${driver.name} ${driver.surname}`}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex gap-4">
                <InputField
                  id="startDate"
                  name="startDate"
                  type="text"
                  value={truckLoadData.startDate}
                  label="Departure date*"
                  autoComplete="off"
                  placeholder="DD/MM/YYYY"
                  onChange={handleTruckLoadDataInputChange}
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
                />
              </div>

              <div className="flex gap-4">
                <InputField
                  id="startTime"
                  name="startTime"
                  type="text"
                  value={truckLoadData.startTime}
                  label="Departure time*"
                  autoComplete="off"
                  placeholder="hh:mm"
                  onChange={handleTruckLoadDataInputChange}
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
              />

              <div className="flex flex-col">
                <div className="mb-1 mt-1 flex items-center justify-between">
                  <span className="px-1 py-2 text-sm">Load items:</span>
                  <button
                    type="button"
                    className="btn btn-neutral h-10 min-h-10 self-end rounded-full px-8 3xl:h-12 3xl:min-h-12"
                    disabled={selectedLoadItem === null}
                    onClick={handleRemoveLoadItem}
                  >
                    Remove item
                  </button>
                </div>
                <div className="max-h-24 overflow-x-auto">
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
                            className={`${index === selectedTableRow ? "bg-primary text-primary-content" : ""} cursor-pointer`}
                            onClick={() => handleRowClick(index)}
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
              </div>
            </div>

            <hr className="hidden 3xl:block" />

            <div className="flex w-2/5 flex-col pl-3 3xl:mt-2 3xl:w-full 3xl:border-none 3xl:p-0">
              <InputField
                id="name"
                name="name"
                type="text"
                value={loadItemData.name}
                label="Item name*"
                autoComplete="off"
                onChange={handleLoadItemDataInputChange}
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
              />

              <button
                type="button"
                className="btn btn-neutral mt-3 h-10 min-h-10 self-end rounded-full px-8 3xl:mb-7 3xl:mt-3 3xl:h-12 3xl:min-h-12"
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
        onCloseWithFormReset={handleDialogModalCloseWithFormReset}
        type={dialogModalType}
        pdfDocument={
          <TruckLoadPDF
            heading="Add truck load"
            truckLoadData={truckLoadData}
            loadItems={loadItems}
          />
        }
      />
    </main>
  );
};

export default AddTruckLoadPage;
