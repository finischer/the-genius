import moment from "moment";

export function formatTimestamp(d: string, format = "DD.MM.yyyy, HH:mm [Uhr]") {
  const formattedStringDate: string = moment(d).format(format);
  return formattedStringDate;
}
