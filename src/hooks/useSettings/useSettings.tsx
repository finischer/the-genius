import type { MantineThemeColors } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

const useSettings = () => {
    const [primaryColor, setPrimaryColor] = useLocalStorage<keyof MantineThemeColors>({ key: "primaryColor", defaultValue: "brand" })

    const updatePrimaryColor = (newColor: keyof MantineThemeColors) => {
        setPrimaryColor(newColor)
    }

    return { primaryColor, updatePrimaryColor }

}

export default useSettings