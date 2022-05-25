import dayjs from "dayjs";
export function getDate(time) {
  let timeObj = dayjs(time);
  let formattedDate = timeObj.format("DD/MM/YYYY");

  return formattedDate;
}
