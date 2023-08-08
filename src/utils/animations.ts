import { keyframes } from "@mantine/core";
import {
  fadeIn,
  zoomIn,
  zoomOut,
  slideInDown,
  fadeOut,
} from "react-animations";

export const fadeInAnimation = keyframes(fadeIn);
export const fadeOutAnimation = keyframes(fadeOut);
export const zoomInAnimation = keyframes(zoomIn);
export const zoomOutAnimation = keyframes(zoomOut);
export const slideInAnimation = keyframes(slideInDown);

export const fadeInOutVariant = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

export const animations = {
  fadeInOut: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: fadeInOutVariant,
  },
};
