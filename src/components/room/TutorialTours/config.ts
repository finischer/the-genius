import { type MantineTheme } from "@mantine/core";
import type { Props as ReactJoyRideProps, Step } from "react-joyride";
import { colors } from "~/styles/constants";

export const scorebarStep: Step = {
  target: ".scorebar",
  title: "Scorebar",
  content: "Hier siehst du den Spielstand eines Teams."
};

export const welcomeStep: Step = {
  target: ".interactive-tour-header",
  content:
    "Willkommen! Nimm dir einen Moment Zeit, um dich mit der Oberfläche vertraut zu machen.",
  placement: "center",
  title: "Willkommen!",
  styles: {
    options: {
      arrowColor: "rgba(0, 0, 0, 0)"
    }
  }
};

export const generalSettingStep: Step = {
  target: ".room-settings-btn",
  title: "Einstellungen",
  content: "Klicke hier, um das Einstellungsmenü zu öffnen."
};

export const interactiveTourDefaultProps = (
  theme: MantineTheme
): Omit<ReactJoyRideProps, "steps" | "run"> => {
  return {
    showProgress: true,
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    continuous: true,
    locale: {
      back: "Zurück",
      close: "Schließen",
      last: "Fertig",
      next: "Weiter",
      skip: "Überspringen"
    },
    styles: {
      buttonBack: {
        color: theme.colors.textLight[1]
      },
      options: {
        arrowColor: theme.colors.dark[6],
        backgroundColor: theme.colors.dark[6],
        overlayColor: "rgba(0, 0, 0, 0.8)",
        primaryColor: colors.brand,
        textColor: colors.textLight,
        zIndex: 9999
      }
    }
  };
};
