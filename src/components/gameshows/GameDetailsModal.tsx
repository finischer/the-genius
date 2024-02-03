import { Modal, Text, type ModalProps } from "@mantine/core";
import type { Game } from "@prisma/client";
import React, { type FC } from "react";

interface IGameDetailsModalProps extends ModalProps {
  game: Game;
}

const GameDetailsModal: FC<IGameDetailsModalProps> = ({ game, ...props }) => {
  const ModalTitle = () => (
    <Text
      fw="bold"
      fz="md"
    >
      {game.name}
    </Text>
  );

  return (
    <Modal
      {...props}
      title={<ModalTitle />}
    >
      <Text>Slug: {game.slug}</Text>
      <Text>Modus: {game.mode}</Text>
      {/* <Text>Regeln: {game.rules}</Text> */}
    </Modal>
  );
};

export default GameDetailsModal;
