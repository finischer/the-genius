import { Flex, NumberInput } from "@mantine/core";
import { parseInt } from "lodash";
import { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import MerkenPlayground from "~/components/room/Game/games/Merken/components/MerkenPlayground/MerkenPlayground";
import { Games } from "~/components/room/Game/games/game.types";
import { StepperControlsContext } from "~/context/StepperControlsContext";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import { shuffleArray } from "~/utils/array";

const MAX_TIME_TO_THINK_SECONDS = 180; // 3 minutes
const MIN_TIME_TO_THINK_SECONDS = 1;

const PATH_TO_ICONS = "/icons/merken";

const MerkenConfigurator = () => {
  const { disableContinueButton, enableContinueButton } = useContext(StepperControlsContext);
  const { merken, updateGame } = useGameshowConfig(Games.MERKEN);
  const cards = new Array(24).fill(null).map((_, idx) => `${PATH_TO_ICONS}/${idx + 1}.png`);
  const [openCards, updateOpenCards] = useImmer<number[]>([]);

  const updateTimeToThink = (value: number | string) => {
    const convertedValue = typeof value === "string" ? parseInt(value) : value;

    updateGame((draft) => {
      draft.timerState.timeToThinkSeconds = convertedValue;
    });
  };

  const handleCardClick = (index: number) => {
    updateOpenCards((draft) => {
      if (openCards.includes(index)) {
        return draft.filter((i) => i !== index);
      } else {
        draft.push(index);
      }
    });
  };

  useEffect(() => {
    const timeToThink = merken.timerState.timeToThinkSeconds;
    if (timeToThink >= MIN_TIME_TO_THINK_SECONDS && timeToThink <= MAX_TIME_TO_THINK_SECONDS) {
      enableContinueButton();
    } else {
      disableContinueButton();
    }
  }, [merken]);

  useEffect(() => {
    updateGame((draft) => {
      draft.cards = shuffleArray(cards);
    });
  }, []);

  return (
    <Flex
      direction="column"
      gap="md"
      align="center"
    >
      <NumberInput
        defaultValue={merken.timerState.timeToThinkSeconds}
        label="Nachdenkzeit"
        description="in Sekunden"
        min={MIN_TIME_TO_THINK_SECONDS}
        max={MAX_TIME_TO_THINK_SECONDS}
        size="md"
        onChange={updateTimeToThink}
        value={merken.timerState.timeToThinkSeconds}
      />

      <MerkenPlayground
        cards={cards}
        openCards={openCards}
        clickable
        onCardClick={handleCardClick}
      />
    </Flex>
  );
};

export default MerkenConfigurator;
