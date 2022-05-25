import dayjs from "dayjs";
export function getReadableDateDisplay(time) {
  let timeObj = dayjs(time);
  let formattedDate = timeObj.format("DD/MM/YYYY");
  let sameDay = dayjs().isSame(formattedDate, "day");
  if (sameDay) {
    let sameHour = dayjs().hour() === timeObj.hour();
    let minDiff = dayjs().minute() - timeObj.minute();
    let hourDiff = dayjs().hour() - timeObj.hour();
    let minText = minDiff > 1 ? "minutes" : "minute";
    let hourText = hourDiff > 1 ? "hours" : "hour";
    if (minDiff === 0) return " Just Now";
    else if (sameHour) return `${minDiff} ${minText} ago`;
    else return `${hourDiff} ${hourText} ago`;
  }
  return formattedDate;
}
