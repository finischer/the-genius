import Head from "next/head";
import React from "react";
import type { INextHeadProps } from "./nextHead.types";

const NextHead: React.FC<INextHeadProps> = ({ title }) => {
  const t = title ?? "";

  const titleStr = `${t} ${t && "|"} TheGenius`;

  return (
    <Head>
      <title>{titleStr}</title>
    </Head>
  );
};

export default NextHead;
