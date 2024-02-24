import type { MantineThemeColors } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { LOCAL_STORAGE_KEYS } from "~/config/localStorage";

const useSettings = () => {
  const [primaryColor, setPrimaryColor] = useLocalStorage<keyof MantineThemeColors>({
    key: LOCAL_STORAGE_KEYS.PRIMARY_COLOR,
    defaultValue: "brand",
  });

  const updatePrimaryColor = (newColor: keyof MantineThemeColors) => {
    setPrimaryColor(newColor);
  };

  return { primaryColor, updatePrimaryColor };
};

export default useSettings;
