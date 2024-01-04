import {
  createTheme,
  rem,
  type MantineColorsTuple,
  Box,
  Menu,
  Button,
  Paper,
  Card,
  Modal,
  ActionIcon,
} from "@mantine/core";
import { GameshowMode } from "@prisma/client";
import { generateColors } from "@mantine/colors-generator";
import type { CSSVariablesResolver } from "@mantine/core";

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
  accent: "#7248D0",
  success: "#5AFF15",
  textLight: "#E6DFF7",
  textDimmed: "#839BAF",
  textDark: "#181F25",
  brand: "#8931B2",
  gold: "#F6BD60",
};

export const GAMESHOW_MODES: GameshowMode[] = Object.values(GameshowMode).filter((mode) =>
  isNaN(Number(mode))
);

function createMantineColor(color: string): MantineColorsTuple {
  return generateColors(color);
}

export const THEME = createTheme({
  fontFamily: "Montserrat, sans-serif",
  primaryColor: "brand",
  black: "gray-9",
  white: "gray-1",
  // defaultRadius: rem(5),
  components: {
    Paper: Paper.extend({
      defaultProps: {
        py: rem(16),
        px: rem(16),
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        c: "white",
      },
    }),
  },
  radius: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(20),
  },
  colors: {
    success: createMantineColor(colors.success),
    textLight: createMantineColor(colors.textLight),
    textDimmed: createMantineColor(colors.textDimmed),
    textDark: createMantineColor(colors.textDark),
    gold: createMantineColor(colors.gold),
    brand: createMantineColor(colors.brand),
  },
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  spacing: {
    xs: rem(6),
    sm: rem(12),
    md: rem(18),
    lg: rem(24),
    xl: rem(32),
  },
  fontSizes: {
    xs: rem(14),
    sm: rem(16),
    md: rem(18),
    lg: rem(28),
    xl: rem(38),
  },
  defaultGradient: {
    from: "brand.9",
    to: "brand.4",
    deg: 45,
  },
});

export const cssResolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: {
    // "--mantine-color-gray-filled": theme.colors,
  },
  dark: {
    // "--mantine-color-primary-filled": theme.colors.primary[9],
  },
});
