import Head from "next/head";
import React from "react";
import type { INextHeadProps } from "./nextHead.types";

const NextHead: React.FC<INextHeadProps> = ({ title }) => {
  const titleStr = `${title} ${title && "|"} TheGenius`;

  return (
    <Head>
      <title>{titleStr}</title>
    </Head>
  );
};

export default NextHead;
