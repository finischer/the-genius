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
