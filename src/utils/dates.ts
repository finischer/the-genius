import moment from "moment";

export function formatTimestamp(d: string | Date, format = "DD.MM.yyyy, HH:mm", suffix = "Uhr") {
  const formattedStringDate: string = moment(d.toString()).format(format);
  return formattedStringDate.concat(` ${suffix}`);
}
