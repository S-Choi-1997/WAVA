import React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

/**
 *
 * @param {Date} date
 * @returns
 */
// function getYMD(date) {
//   const year = date.getFullYear().toString();
//   let month = (date.getMonth() + 1).toString();
//   let day = (date.getDate() + 1).toString();
//   return year + "-" + month + "-" + day;
// }

function DateRangePicker({ timeSet, editTimeSet }) {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={["DatePicker"]}
            className="w-full sm:w-1/2"
          >
            <DatePicker
              value={dayjs(timeSet)}
              onChange={(e) => editTimeSet(new Date(e))}
              format="YYYY-MM-DD"
              label=""
              className="w-full"
            />
          </DemoContainer>
          <DemoContainer
            components={["TimePicker"]}
            className="w-full sm:w-1/2"
          >
            <TimePicker
              onChange={(e) => editTimeSet(new Date(e))}
              value={dayjs(timeSet)}
              format="hh:mm A"
              label=""
              className="w-full"
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default DateRangePicker;
