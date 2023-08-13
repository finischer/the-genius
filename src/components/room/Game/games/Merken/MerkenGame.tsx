import React from "react";
import { type IMerkenGameProps } from "./merken.types";
import MerkenPlayground from "./components/MerkenPlayground/MerkenPlayground";
import { Button, Flex } from "@mantine/core";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";

const MerkenGame: React.FC<IMerkenGameProps> = ({ game }) => {
  const { isHost } = useUser()
  const isStartButtonDisabled = game.timerState.isActive

  const handleStartGame = () => {
    if (!isHost || isStartButtonDisabled) return // to make sure not start the game unintentionally
    socket.emit("merken:startGame")
  }

  return <Flex direction="column" gap="lg">
    <MerkenPlayground cards={game.cards} openCards={game.openCards} allCardsFlipped={game.allCardsFlipped} />
    {isHost && <Button onClick={handleStartGame} disabled={isStartButtonDisabled}>Spiel starten</Button>}
  </Flex>;
};

export default MerkenGame;
