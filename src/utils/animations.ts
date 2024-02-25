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
