import _ from "lodash";

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function slug(str: string | number | (string | number)[]) {
  let tmp = str;

  if (tmp instanceof Array) {
    tmp = tmp.join(" ");
  }

  return _.kebabCase(tmp.toString());
}
