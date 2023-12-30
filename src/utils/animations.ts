import { fadeIn, zoomIn, zoomOut, slideInDown, fadeOut } from "react-animations";

export const fadeInAnimation = fadeIn;
export const fadeOutAnimation = fadeOut;
export const zoomInAnimation = zoomIn;
export const zoomOutAnimation = zoomOut;
export const slideInAnimation = slideInDown;

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
