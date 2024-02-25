import { NextSeo } from "next-seo";
import React from "react";
import type { INextHeadProps } from "./nextHead.types";

const NextHead: React.FC<INextHeadProps> = ({ title }) => {
  return (
    <NextSeo
      title={title}
      titleTemplate="%s | The Genius"
      defaultTitle="TheGenius"
      openGraph={{
        title: title,
      }}
    />
  );
};

export default NextHead;
