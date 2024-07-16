import { Image, UnstyledButton } from "@mantine/core";
import { type FC } from "react";
import { TheGeniusConfig } from "~/config/the-genius";

interface IBuyMeACoffeeButtonProps {
  width?: number;
}

const DEFAULT_BUTTON_WIDTH_PX = 200;

export const BuyMeACoffeeButton: FC<IBuyMeACoffeeButtonProps> = ({
  width = DEFAULT_BUTTON_WIDTH_PX
}) => {
  return (
    <UnstyledButton
      component="a"
      href={TheGeniusConfig.socialMedia.buyMeACoffee}
      target="_blank"
    >
      <Image src="/images/bmc-button.svg" w={width} alt="bmc-button" />
    </UnstyledButton>
  );
};
