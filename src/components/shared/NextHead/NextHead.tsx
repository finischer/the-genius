import Head from "next/head";
import React from "react";
import type { INextHeadProps } from "./nextHead.types";

const NextHead: React.FC<INextHeadProps> = ({ title }) => {
  return (
    <Head>
      <title>
        {title} {title && "|"} TheGenius
      </title>
    </Head>
  );
};

export default NextHead;
