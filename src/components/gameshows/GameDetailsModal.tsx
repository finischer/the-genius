import { Modal, Text, type ModalProps, rem, Divider } from "@mantine/core";
import type { Game } from "@prisma/client";
import React, { type FC } from "react";
import type { TGameNames } from "../room/Game/games/game.types";
import { DEFAULT_FLAGGEN_STATE } from "../room/Game/games/Flaggen/config";
import { DEFAULT_DUSAGST_STATE } from "../room/Game/games/DuSagst/config";
import { DEFAULT_GEHEIMWOERTER_STATE } from "../room/Game/games/Geheimwörter/config";
import { DEFAULT_MEMORY_STATE } from "../room/Game/games/Memory/config";
import { DEFAULT_MERKEN_STATE } from "../room/Game/games/Merken/config";
import { DEFAULT_REFERAT_BINGO_STATE } from "../room/Game/games/ReferatBingo/config";
import { DEFAULT_SET_STATE } from "../room/Game/games/Set/config";
import { formatTimestamp } from "~/utils/dates";

interface IGameDetailsModalProps extends ModalProps {
  game: Game;
}

type TGameRulesMap = {
  [index in TGameNames]: string;
};

const gameRulesMap: TGameRulesMap = {
  flaggen: DEFAULT_FLAGGEN_STATE.getRules(),
  duSagst: DEFAULT_DUSAGST_STATE.getRules(),
  geheimwoerter: DEFAULT_GEHEIMWOERTER_STATE.getRules(),
  memory: DEFAULT_MEMORY_STATE.getRules(),
  merken: DEFAULT_MERKEN_STATE.getRules(),
  referatBingo: DEFAULT_REFERAT_BINGO_STATE.getRules(),
  set: DEFAULT_SET_STATE.getRules(),
};

const GameDetailsModal: FC<IGameDetailsModalProps> = ({ game, ...props }) => {
  const ModalTitle = () => (
    <>
      <Text
        fw="bold"
        fz="md"
      >
        {game.name}
      </Text>
      <Text c="dimmed">Hinzugefügt am: {formatTimestamp(game.createdAt, "DD.MM.YYYY", "")}</Text>
    </>
  );

  return (
    <Modal
      {...props}
      size="xl"
      centered
      title={<ModalTitle />}
    >
      <Text>Modus: {game.mode}</Text>
      <Divider my="md" />
      <Text>Regeln: {gameRulesMap[game.slug as TGameNames]}</Text>
    </Modal>
  );
};

export default GameDetailsModal;
