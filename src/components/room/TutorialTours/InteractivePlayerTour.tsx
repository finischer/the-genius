import ReactJoyride, { type Step } from "react-joyride";
import {
  generalSettingStep,
  interactiveTourDefaultProps,
  scorebarStep,
  welcomeStep
} from "./config";
import { useMantineTheme } from "@mantine/core";

const steps: Step[] = [
  welcomeStep,
  generalSettingStep,
  scorebarStep,
  {
    target: ".scorebar",
    title: "Buzzern",
    content:
      "Wann immer du buzzern musst, kannst du das mit Leertaste machen. Alternativ kannst du auch auf das Banner klicken, welches das aktuelle Spiel anzeigt. Dieser wird während eines Spiels oben rechts in der Ecke angezeigt."
  }
];

const InteractivePlayerTour = () => {
  const theme = useMantineTheme();
  return (
    <ReactJoyride
      {...interactiveTourDefaultProps(theme)}
      beaconComponent={() => null}
      steps={steps}
    />
  );
};

export default InteractivePlayerTour;
