import ReactJoyride, { type Step } from "react-joyride";
import {
  generalSettingStep,
  interactiveTourDefaultProps,
  scorebarStep,
  welcomeStep
} from "./config";
import { useMantineTheme } from "@mantine/core";
import CustomTooltip from "./CustomTooltip";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";
import { LOCAL_STORAGE_KEYS } from "~/config/localStorage";

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
  const [runTour] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.PLAYER_TOUR,
    defaultValue: true,
    getInitialValueInEffect: false
  });

  const [run] = useState(runTour);
  const theme = useMantineTheme();

  return (
    <ReactJoyride
      {...interactiveTourDefaultProps(theme)}
      beaconComponent={() => null}
      steps={steps}
      run={run}
      tooltipComponent={(props) => (
        <CustomTooltip tourId={LOCAL_STORAGE_KEYS.PLAYER_TOUR} {...props} />
      )}
    />
  );
};

export default InteractivePlayerTour;
