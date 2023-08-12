import moment from "moment";

export function formatTimestamp(d: string, format = "DD.MM.yyyy, HH:mm") {
  const formattedStringDate: string = moment(d).format(format);
  return formattedStringDate;
}