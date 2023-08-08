import React from "react";
import { type IMerkenGameProps } from "./merken.types";
import MerkenPlayground from "./components/MerkenPlayground/MerkenPlayground";
import { Button, Flex } from "@mantine/core";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";

const MerkenGame: React.FC<IMerkenGameProps> = ({ game }) => {
  const { isHost } = useUser()

  const handleStartGame = () => {
    if (!isHost) return
    socket.emit("merken:startGame")
  }

  return <Flex direction="column" gap="lg">

    <MerkenPlayground cards={game.cards} openCards={game.openCards} allCardsFlipped={game.allCardsFlipped} />
    {isHost && <Button onClick={handleStartGame}>Spiel starten</Button>}
  </Flex>;
};

export default MerkenGame;
