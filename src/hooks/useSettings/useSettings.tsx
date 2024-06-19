import type { MantineThemeColors } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { LOCAL_STORAGE_KEYS } from "~/config/localStorage";

type IUserSettings = {
  volume: {
    soundEffects: number;
    music: number;
  };
};

const useSettings = () => {
  const [primaryColor, setPrimaryColor] = useLocalStorage<keyof MantineThemeColors>({
    key: LOCAL_STORAGE_KEYS.PRIMARY_COLOR,
    defaultValue: "brand",
  });

  const [settings, setSettings] = useLocalStorage<IUserSettings>({
    key: LOCAL_STORAGE_KEYS.SETTINGS,
    defaultValue: {
      volume: {
        soundEffects: 75,
        music: 50,
      },
    },
  });

  const updatePrimaryColor = (newColor: keyof MantineThemeColors) => {
    setPrimaryColor(newColor);
  };

  return { primaryColor, updatePrimaryColor, settings, updateSettings: setSettings };
};

export default useSettings;
