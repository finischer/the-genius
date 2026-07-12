import { useState, type FC } from "react";
import {
  ACTIONS,
  EVENTS,
  STATUS,
  type CallBackProps,
  type Events,
  type Status,
  type Step
} from "react-joyride";
import {
  generalSettingStep,
  scorebarStep,
  welcomeStep
} from "~/components/shared/Tours/config";
import { useLocalStorage } from "@mantine/hooks";
import { LOCAL_STORAGE_KEYS } from "~/config/localStorage";
import InteractiveTour from "~/components/shared/Tours";

const steps: Step[] = [
  welcomeStep,
  generalSettingStep,
  scorebarStep,
  {
    target: ".scorebar-settings",
    title: "Scorebar - Funktionen",
    content:
      "Hier hast du die Möglichkeit weitere Einstellungen für das Team vorzunehmen. Hover über die Icons, um deren Funktion zu erfahren."
  },
  {
    target: ".mod-panel-btn",
    title: "Mod-Panel",
    content:
      "Als Moderator kannst du das Mod-Panel öffnen. Hier kannst du Spiele starten, Szenen wechseln und Musik/Audio steuern."
  },
  {
    target: ".mod-panel-start-games-accordion",
    title: "Spiele starten",
    content:
      "Hier kannst du Spiele starten und deren Regeln lesen. Wähle ein Spiel aus und klicke auf 'Starten'."
  },
  {
    target: ".mod-panel-change-scene-accordion",
    title: "Ansichten",
    content: "Hier kannst du zwischen verschiedenen Ansichten wechseln."
  },
  {
    target: ".mod-panel-actions-accordion",
    title: "Aktionen",
    content:
      "Hier findest du allgemeine Aktionen, die du im Raum durchführen kannst."
  },
  {
    target: ".mod-panel-sounds-accordion",
    title: "Sounds",
    content:
      "Möchtest du selbst Sounds einspielen? Dann tue das hier. Sobald du einen Sound abspielst, wird er im Raum hörbar sein"
  },
  {
    target: ".mod-panel-media-player",
    title: "Musik",
    content:
      "Für eine spannenende Atmosphäre im Spiel kannst du Musik abspielen. Wähle einfach ein Lied aus und jeder im Raum wird es hören. Ich empfehle dir die Musik zwischen den Spielen auszuschalten"
  },
  {
    target: ".game-reset-banner",
    title: "Spiel zurücksetzen",
    content:
      "Klicke auf den Spielnamen oben rechts, um das aktuelle Spiel zurückzusetzen."
  }
];

interface IInteractiveModerationTourProps {
  openModPanel: () => void;
}

const InteractiveModerationTour: FC<IInteractiveModerationTourProps> = ({
  openModPanel
}) => {
  const [runTour] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.MOD_TOUR,
    defaultValue: true,
    getInitialValueInEffect: false
  });
  const [run, setRun] = useState(runTour);
  const [stepIndex, setStepIndex] = useState(0);

  const handleInteractiveModerationTourCallback = (data: CallBackProps) => {
    const { index, action, step, type, status } = data;

    if (action === ACTIONS.CLOSE) {
      setRun(false);
      return;
    }

    const nextStep = () => {
      if (
        ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(
          type
        )
      ) {
        // Update state to advance the tour
        setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
      } else if (
        ([STATUS.FINISHED, STATUS.SKIPPED] as Status[]).includes(status)
      ) {
        // You need to set our running state to false, so we can restart if we click start again.
        setRun(false);
      }
    };

    if (
      action === ACTIONS.NEXT &&
      step.target === ".mod-panel-btn" &&
      type === "step:after"
    ) {
      // Open mod-panel
      openModPanel();

      setTimeout(() => {
        nextStep();
      }, 300);
    } else {
      nextStep();
    }
  };

  return (
    <InteractiveTour
      run={run}
      steps={steps}
      tourId={LOCAL_STORAGE_KEYS.MOD_TOUR}
      stepIndex={stepIndex}
      callback={handleInteractiveModerationTourCallback}
    />
  );
};

export default InteractiveModerationTour;
