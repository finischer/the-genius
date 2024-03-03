import { Button } from "@mantine/core";
import { Flex, Stack } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Scorebar from "~/components/room/Scorebar";
import { connectToSocket } from "~/config/store";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";
import { sizes } from "~/styles/constants";

const RoomUI = () => {
  const params = useParams();

  const roomId = params?.id as string;

  const room = useSyncedRoom();

  useEffect(() => {
    if (!roomId) return;
    connectToSocket(roomId);
  }, [roomId]);

  if (!room.isLoaded) {
    return <div>Loading ...</div>;
  }

  return (
    <Flex
      h="100vh"
      p={sizes.padding}
      pos="relative"
      direction="column"
    >
      <Flex
        h="100%"
        align="center"
        justify="center"
        direction="column"
      >
        {/* <Button onClick={() => room.joinTeam(user.id, room.teams.teamOne.id)}>Join Team 1</Button>
        <Button onClick={() => room.leaveTeam(user.id)}>Leave Team 1</Button>
        <h1>Team 1: {room.teams.teamOne.name}</h1>
        <h3>Spieler: </h3>
        {room.teams.teamOne.players.map((player) => (
          <pre key={player.id}>
            <code>{JSON.stringify(player, null, 2)}</code>
          </pre>
        ))} */}

        {/* Footer View */}
        <Flex
          justify="space-between"
          align="flex-end"
        >
          <Scorebar
            team={room.teams.teamOne}
            timerPosition="right"
          />
          {/* <AnswerBanner
             answer={room.state.answerState.answer}
             size="l"
             showAnswer={room.state.answerState.showAnswer}
             mx="xl"
           /> */}
          <Scorebar
            team={room.teams.teamTwo}
            timerPosition="left"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default RoomUI;
