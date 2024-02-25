import { Divider, Modal, Text, type ModalProps } from "@mantine/core";
import { capitalize } from "lodash";
import { type FC } from "react";
import Markdown from "react-markdown";
import { type TGame } from "../room/Game/games/game.types";
import { getFormattedGameRules } from "~/utils/gameHelpers";

interface IGameDetailsModalProps extends ModalProps {
  game: TGame;
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
