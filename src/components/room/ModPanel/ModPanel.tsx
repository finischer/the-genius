import {
  Accordion,
  Button,
  Drawer,
  Flex,
  ScrollArea,
  Text,
  Title,
  type ButtonProps,
  Group,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import type { RoomViews } from "@prisma/client";
import { IconCheck, IconQuestionMark, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import GameRulesModal from "~/components/shared/GameRulesModal/GameRulesModal";
import Tooltip from "~/components/shared/Tooltip/Tooltip";
import useLoadingState from "~/hooks/useLoadingState/useLoadingState";
import useNotification from "~/hooks/useNotification";
import { useRoom } from "~/hooks/useRoom";
import { socket } from "~/hooks/useSocket";
import type { TGame, TGameNames } from "../Game/games/game.types";
import { type IModPanelProps } from "./modPanel.types";
import MediaPlayer from "../MediaPlayer";
import useAudio from "~/hooks/useAudio";
import ActionIcon from "~/components/shared/ActionIcon";

const TIMER_SECONDS = 10;

const ModPanel: React.FC<IModPanelProps> = ({ disclosure }) => {
  const { showErrorNotification } = useNotification();
  const router = useRouter();
  const { pageIsLoading } = useLoadingState();
  const [openedItems, setOpenedItems] = useLocalStorage<string[]>({
    key: "modPanelOpenedItems",
    defaultValue: [],
  });

  // for game rules
  const [openedGameRules, { open: openGameRules, close: closeGameRules }] = useDisclosure();
  const [clickedGame, setClickedGame] = useState<TGame>();

  const { room, currentGame } = useRoom();
  const [isOpen, { close: closeModPanel }] = disclosure;
  const btnVariantDefault: ButtonProps = { variant: "default" };
  const titleOrder = 3;

  const teamArray = Object.values(room.teams);

  const buzzerPressed = teamArray.filter((t) => t.isActiveTurn || t.buzzer.isPressed).length > 0;
  const isOneScorebarTimerActive = teamArray.filter((t) => t.scorebarTimer.isActive).length > 0;

  const allPlayers = teamArray.map((t) => t.players).flat();
  const atLeastOneNotefieldIsActive = allPlayers.filter((p) => p.states.notefield.isActive).length > 0;

  const { triggerAudioEvent } = useAudio();

  const handleOpenGameRules = (game: TGame) => {
    setClickedGame(game);
    openGameRules();
  };

  const releaseBuzzer = () => {
    socket.emit("releaseBuzzer");
  };

  const hideAnswer = () => {
    socket.emit("hideAnswerBanner");
  };

  const toggleNotefields = () => {
    // TODO: handle if one notefield is not active and other ones are active
    socket.emit("toggleNotefields");
  };

  const handleStartTimer = () => {
    socket.emit("startTimer", TIMER_SECONDS);
  };

  const gameBtns = room.games.map((g) => {
    const btnDisabled = g.identifier === currentGame?.identifier && room.state.view === "GAME";

    return (
      <Button.Group key={g.identifier}>
        <Button
          {...btnVariantDefault}
          disabled={btnDisabled}
          onClick={() => startGame(g.identifier)}
          w="100%"
        >
          {g.name} {btnDisabled && "(Läuft gerade)"}
        </Button>
        {g.rules && (
          <Tooltip
            label="Regeln anzeigen"
            openDelay={500}
          >
            <Button
              {...btnVariantDefault}
              onClick={() => handleOpenGameRules(g)}
            >
              <IconQuestionMark />
            </Button>
          </Tooltip>
        )}
      </Button.Group>
    );
  });

  const startGame = (gameIdentifier: TGameNames) => {
    hideAnswer();
    socket.emit("startGame", { gameIdentifier });
    triggerAudioEvent("playSound", "intro");
  };

  const changeView = (newView: RoomViews) => {
    hideAnswer();
    socket.emit("changeView", { newView });
  };

  const closeRoom = () => {
    modals.openConfirmModal({
      id: "closeRoom",
      title: "Bist du dir sicher?",
      children: (
        <Text size="sm">
          Möchtest du wirklich den Raum schließen? Der aktuelle Fortschritt geht verloren und kann nicht
          wiederhergestellt werden.
        </Text>
      ),
      labels: { confirm: "Ja", cancel: "Nein" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        notifications.show({
          id: "closeRoom",
          message: "Raum wird geschlossen",
          loading: true,
        });

        socket.emit("closeRoom", { roomId: room.id }, async ({ closeSuccessful }) => {
          if (closeSuccessful) {
            const routeDone = await router.push("/rooms");

            if (routeDone) {
              notifications.update({
                id: "closeRoom",
                title: "Erfolgreich",
                message: "Raum wurde erfolgreich geschlossen",
                loading: false,
                icon: <IconCheck size="1rem" />,
              });
            }
          } else {
            showErrorNotification({
              message: "Raum konnte nicht geschlossen werden",
            });
          }
        });
      },
    });
  };

  return (
    <>
      {clickedGame && (
        <GameRulesModal
          zIndex={999}
          opened={openedGameRules}
          onClose={closeGameRules}
          gameName={clickedGame.name}
          rules={clickedGame.rules}
        />
      )}
      <Drawer
        opened={isOpen}
        onClose={closeModPanel}
        title="Mod-Panel"
        offset={8}
        radius="md"
        overlayProps={{
          opacity: 0.15,
        }}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Flex
          h="100%"
          direction="column"
          gap="xl"
          justify="space-between"
        >
          <Flex
            direction="column"
            gap="sm"
          >
            <Accordion
              defaultValue={openedItems}
              variant="separated"
              multiple
              onChange={setOpenedItems}
            >
              <Accordion.Item value="startGame">
                <Accordion.Control>
                  <Title order={titleOrder}>Spiel starten</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button.Group orientation="vertical">{gameBtns}</Button.Group>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="views">
                <Accordion.Control>
                  <Title order={titleOrder}>Ansichten</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button.Group orientation="vertical">
                    <Button
                      {...btnVariantDefault}
                      onClick={() => changeView("EMPTY")}
                    >
                      Leer
                    </Button>
                    <Button
                      {...btnVariantDefault}
                      onClick={() => changeView("SCOREBOARD")}
                    >
                      Scoreboard
                    </Button>
                  </Button.Group>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="actions">
                <Accordion.Control>
                  <Title order={titleOrder}>Aktionen</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button.Group orientation="vertical">
                    <Button
                      {...btnVariantDefault}
                      onClick={handleStartTimer}
                      disabled={room.state.display.clock.isActive}
                    >
                      {TIMER_SECONDS}s Timer starten
                    </Button>
                    <Button
                      {...btnVariantDefault}
                      onClick={toggleNotefields}
                    >
                      Notizfelder {atLeastOneNotefieldIsActive ? "ausblenden" : "einblenden"}
                    </Button>
                    <Button
                      {...btnVariantDefault}
                      onClick={releaseBuzzer}
                      disabled={!buzzerPressed || isOneScorebarTimerActive}
                    >
                      Alle Buzzer freigeben
                    </Button>
                    <Button
                      {...btnVariantDefault}
                      onClick={hideAnswer}
                      disabled={!room.state.answerState.showAnswer}
                    >
                      Antwort ausblenden
                    </Button>
                    <Button
                      {...btnVariantDefault}
                      disabled
                    >
                      Konfetti regnen lassen
                    </Button>
                  </Button.Group>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="sounds">
                <Accordion.Control>
                  <Title order={titleOrder}>Sounds</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button.Group orientation="vertical">
                    <Button
                      {...btnVariantDefault}
                      onClick={() => triggerAudioEvent("playSound", "bell")}
                    >
                      Korrekte Antwort
                    </Button>
                    <Button
                      {...btnVariantDefault}
                      onClick={() => triggerAudioEvent("playSound", "bass")}
                    >
                      Falsche Antwort
                    </Button>
                    <Button
                      {...btnVariantDefault}
                      onClick={() => triggerAudioEvent("playSound", "winning")}
                    >
                      Winner Sound
                    </Button>
                  </Button.Group>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="general">
                <Accordion.Control>
                  <Title order={titleOrder}>Allgemein</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button.Group orientation="vertical">
                    <Button
                      color="red"
                      onClick={closeRoom}
                      loading={pageIsLoading}
                    >
                      Raum schließen
                    </Button>
                  </Button.Group>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <MediaPlayer />
          </Flex>
        </Flex>
      </Drawer>
    </>
  );
};

export default ModPanel;
