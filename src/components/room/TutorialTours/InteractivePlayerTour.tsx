import { type Step } from "react-joyride";
import {
  generalSettingStep,
  scorebarStep,
  welcomeStep
} from "~/components/shared/Tours/config";
import { LOCAL_STORAGE_KEYS } from "~/config/localStorage";
import InteractiveTour from "~/components/shared/Tours";

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
  return (
    <InteractiveTour steps={steps} tourId={LOCAL_STORAGE_KEYS.PLAYER_TOUR} />
  );
};

export default InteractivePlayerTour;
