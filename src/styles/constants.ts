import type { MantineThemeOverride, Tuple } from "@mantine/core";
import { GameshowMode } from "@prisma/client";

export const sizes = {
  base: 25,
  padding: 25,
  borderRadius: 5,
  icon: {
    s: 18,
    m: 24,
    xl: 30,
  },
};

export const spacing = {
  xs: sizes.base / 2, // 2
  s: sizes.base, // 4
  sm: sizes.base * 2, // 8
  m: sizes.base * 3, // 12
  md: sizes.base * 4, // 16
  l: sizes.base * 5, // 20
  xl: sizes.base * 6, // 24
  xxl: sizes.base * 7, // 28
};

export const colors = {
  primary: "#364652",
  primaryDarker: "#28343E",
  accent: "#7248D0",
  success: "#5AFF15",
  textLight: "#E6DFF7",
  textDimmed: "#839BAF",
  textDark: "#181F25",
  brand: "#592FB7",
  gold: "#F6BD60",
};

export const GAMESHOW_MODES: GameshowMode[] = Object.values(GameshowMode).filter((mode) =>
  isNaN(Number(mode))
);

function createMantineColor(color: string): Tuple<string, 10> {
  return new Array(10).fill(color) as unknown as Tuple<string, 10>;
}

export const THEME: MantineThemeOverride = {
  colorScheme: "dark",
  fontFamily: "Montserrat, sans-serif",
  primaryColor: "brand",
  colors: {
    primary: createMantineColor(colors.primary),
    primaryDarker: createMantineColor(colors.primaryDarker),
    success: createMantineColor(colors.success),
    textLight: createMantineColor(colors.textLight),
    textDimmed: createMantineColor(colors.textDimmed),
    textDark: createMantineColor(colors.textDark),
    gold: createMantineColor(colors.gold),
    brand: createMantineColor(colors.accent),
  },
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
};
