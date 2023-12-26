import { useMediaQuery } from "@mantine/hooks";

export const useScreen = () => {
  const isLargeScreen = useMediaQuery("(max-width: 62em)");
  const isMediumScreen = useMediaQuery("(max-width: 48em)");
  const isSmallScreen = useMediaQuery("(max-width: 36em)");

  return { isLargeScreen, isMediumScreen, isSmallScreen };
};
