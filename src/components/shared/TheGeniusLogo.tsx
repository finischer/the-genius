import Image, { type ImageProps } from "next/image";
import React, { type FC } from "react";

type ITheGeniusLogoProps = Omit<ImageProps, "src" | "alt">;

const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 100;

const TheGeniusLogo: FC<ITheGeniusLogoProps> = (props) => {
  return (
    <Image
      height={DEFAULT_HEIGHT}
      width={DEFAULT_WIDTH}
      {...props}
      src="/images/logo.svg"
      alt="the-genius-logo"
    />
  );
};

export default TheGeniusLogo;
