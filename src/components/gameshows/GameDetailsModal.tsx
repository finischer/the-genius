import { Divider, Modal, Text, type ModalProps } from "@mantine/core";
import Handlebars from "handlebars";
import { capitalize } from "lodash";
import { type FC } from "react";
import Markdown from "react-markdown";
import { Games, type TGame } from "../room/Game/games/game.types";
import { GAME_STATE_MAP } from "~/hooks/useGameConfigurator/useGameConfigurator";

interface IGameDetailsModalProps extends ModalProps {
  game: TGame;
}

function getFormattedGameRules(game: TGame) {
  const metadata = {
    gameName: game.name,
    maxPoints: game.maxPoints,
    "maxPoints.equalOne": game.maxPoints === 1,
    modes: game.modes,
  };

  let gameData = {};

  const rules = GAME_STATE_MAP[game.identifier].rules;

  switch (game.identifier) {
    case Games.DUSAGST:
      gameData = {
        "timeToThinkSeconds.equalOne": game.timeToThinkSeconds === 1,
        timeToThinkSeconds: game.timeToThinkSeconds,
      };
      break;
    case Games.MERKEN:
      gameData = {
        "timeToThinkSeconds.equalOne": game.timerState.timeToThinkSeconds === 1,
        timeToThinkSeconds: game.timerState.timeToThinkSeconds,
      };
    default:
      break;
  }

  const data = {
    ...metadata,
    ...gameData,
  };

  const template = Handlebars.compile(rules);

  return template(data);
}

const GameDetailsModal: FC<IGameDetailsModalProps> = ({ game, ...props }) => {
  const ModalTitle = () => (
    <>
      <Text
        fw="bold"
        fz="md"
      >
        {game.name}
      </Text>
    </>
  );

  const gameRules = getFormattedGameRules(game);

  return (
    <Modal
      {...props}
      size="xl"
      centered
      title={<ModalTitle />}
    >
      <Text>Modus: {game.modes.map((mode) => capitalize(mode)).join(", ")}</Text>
      <Divider my="md" />
      <Markdown>{gameRules}</Markdown>
    </Modal>
  );
};

export default GameDetailsModal;
