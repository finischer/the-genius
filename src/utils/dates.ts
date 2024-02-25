import moment from "moment";
import { MONGO_DB_TIME_FORMAT } from "~/config/database";

export function formatTimestamp(d: Date, format = "DD.MM.yyyy, HH:mm", suffix = "Uhr") {
  const ts = moment(d, MONGO_DB_TIME_FORMAT).format(format);
  return ts.concat(` ${suffix}`);
}
