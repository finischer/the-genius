import React, { type FC } from "react";
import { Table as MantineTable } from "@mantine/core";
import type { TableData } from "@mantine/core";
import * as _ from "lodash";

function buildTableBodyData(data: Array<{ [key: string]: any }>, targetKeys: string[]) {
  const body: TableData["body"] = [];

  data.forEach((elem) => {
    const value = targetKeys.map((key) => _.get(elem, key, "-"));
    body.push(value);
  });

  return body;
}

interface ITableProps extends TableData {
  data: Array<{ [key: string]: any }>;
  keys: string[];
}

const Table: FC<ITableProps> = ({ data, keys, caption, head }) => {
  const buildedData = buildTableBodyData(data, keys);

  const tableData: TableData = {
    caption,
    head,
    body: buildedData,
  };

  console.log(tableData);
  return <MantineTable data={tableData} />;
};

export default Table;
