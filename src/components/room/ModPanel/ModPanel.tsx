import {
  Accordion,
  Button,
  Drawer,
  Flex,
  ScrollArea,
  Text,
  Title,
  type ButtonProps
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconQuestionMark } from "@tabler/icons-react";
import React, { useState } from "react";
import GameDetailsModal from "~/components/gameshows/GameDetailsModal";
import Tooltip from "~/components/shared/Tooltip/Tooltip";
import { LOCAL_STORAGE_KEYS } from "~/config/localStorage";
import { roomConfig } from "~/config/room.config";
import useAudio from "~/hooks/useAudio";
import useBuzzer from "~/hooks/useBuzzer";
import useLoadingState from "~/hooks/useLoadingState/useLoadingState";
import useNotefield from "~/hooks/useNotefield";
import useNotification from "~/hooks/useNotification";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import useTimer from "~/hooks/useTimer";
import { RoomView, TimerType } from "~/types/gameshow.types";
import { api } from "~/utils/api";
import { assignObjectKeyByKey } from "~/utils/helpers";
import type { TGame } from "../Game/games/game.types";
import MediaPlayer from "../MediaPlayer";
import { type IModPanelProps } from "./modPanel.types";

const ModPanel: React.FC<IModPanelProps> = ({ disclosure }) => {
  const { mutateAsync: removeActiveRoom } =
    api.rooms.removeActiveRoom.useMutation();

  const { showErrorNotification, showInfoNotification } = useNotification();
  const { pageIsLoading } = useLoadingState();
  const [openedItems, setOpenedItems] = useLocalStorage<string[]>({
    key: LOCAL_STORAGE_KEYS.MOD_PANEL_OPENED_ITEMS,
    defaultValue: []
  });

  const { lockAllBuzzers, unlockAllBuzzers, areAllBuzzersLocked } = useBuzzer();

  // for game rules
  const [openedGameRules, { open: openGameRules, close: closeGameRules }] =
    useDisclosure();
  const [clickedGame, setClickedGame] = useState<TGame>();

  const room = useSyncedRoom();
  const { triggerAudioEvent } = useAudio();
  const { disableAllNotefields, toggleNotefields } = useNotefield();

  const { startTimer, active: isTimerActive } = useTimer(
    room.context.header.timer,
    TimerType.COUNTDOWN,
    roomConfig.modPanel.actions.timerSeconds
  );

  const [isOpen, { close: closeModPanel }] = disclosure;
  const btnVariantDefault: ButtonProps = { variant: "default" };
  const titleOrder = 3;

  const teamArray = Object.values(room.teams);

  const buzzerPressed =
    teamArray.filter((t) => t.isActiveTurn || t.buzzer.isPressed).length > 0;
  const isOneScorebarTimerActive =
    teamArray.filter((t) => t.scorebarTimer.active).length > 0;

  const allPlayers = teamArray.map((t) => t.players).flat();
  const atLeastOneNotefieldIsActive =
    allPlayers.filter((p) => p.context.notefield.isActive).length > 0;

  const handleOpenGameRules = (game: TGame) => {
    setClickedGame(game);
    openGameRules();
  };

  const releaseBuzzer = () => {
    unlockAllBuzzers();

    Object.values(room.teams).forEach((team) => {
      team.isActiveTurn = false;
      team.buzzer.isPressed = false;
      team.buzzer.playersBuzzered = [];
    });
  };

  const hideAnswer = () => {
    room.context.answerState.isAnswerDisplayed = false;
    room.context.answerState.answer = "";
  };

  const gameBtns = room.games.map((g) => {
    const btnDisabled =
      g.identifier === room.context.currentGame?.identifier &&
      room.context.view === RoomView.GAME;

    return (
      <Button.Group key={g.identifier}>
        <Button
          {...btnVariantDefault}
          disabled={btnDisabled}
          onClick={() => startGame(g)}
          w="100%"
        >
          {/* {g.name} */}
          {g.name} {btnDisabled && "(Läuft gerade)"}
        </Button>

        <Tooltip label="Regeln anzeigen" openDelay={500}>
          <Button {...btnVariantDefault} onClick={() => handleOpenGameRules(g)}>
            <IconQuestionMark />
          </Button>
        </Tooltip>
      </Button.Group>
    );
  });

  const startGame = (game: TGame) => {
    hideAnswer();
    assignObjectKeyByKey(
      game as unknown as Record<string, unknown>,
      room.context.currentGame as unknown as Record<string, unknown>
    );
    room.context.view = RoomView.GAME;
    room.context.display.game = false;
    setTimeout(() => {
      room.context.display.gameIntro = true;
    }, 500);
  };

  const changeView = (newView: RoomView) => {
    hideAnswer();
    lockAllBuzzers();
    disableAllNotefields();

    room.context.view = newView;
  };

  const closeRoom = () => {
    modals.openConfirmModal({
      id: "closeRoom",
      title: "Bist du dir sicher?",
      children: (
        <Text size="sm">
          Möchtest du wirklich den Raum schließen? Der aktuelle Fortschritt geht
          verloren und kann nicht wiederhergestellt werden.
        </Text>
      ),
      labels: { confirm: "Ja", cancel: "Nein" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        notifications.show({
          id: "closeRoom",
          message: "Raum wird geschlossen",
          loading: true
        });

        const deletedRoom = await removeActiveRoom({ roomId: room.id });

        if (!deletedRoom) {
          showErrorNotification({
            message: "Raum konnte nicht geschlossen werden"
          });
          return;
        }

        room.context.isClosed = true;

        notifications.update({
          id: "closeRoom",
          title: "Erfolgreich",
          message: "Raum wurde erfolgreich geschlossen",
          loading: false,
          icon: <IconCheck size="1rem" />
        });
      }
    });
  };

  const toggleBuzzerLockState = () => {
    if (areAllBuzzersLocked) {
      unlockAllBuzzers();
      showInfoNotification({ message: "Alle Buzzer entsperrt" });
    } else {
      lockAllBuzzers();
      showInfoNotification({ message: "Alle Buzzer gesperrt" });
    }
  };

  return (
    <>
      {clickedGame && (
        <GameDetailsModal
          game={clickedGame}
          onClose={closeGameRules}
          opened={openedGameRules}
        />
      )}
      <Drawer
        opened={isOpen}
        onClose={closeModPanel}
        title="Mod-Panel"
        offset={8}
        radius="md"
        overlayProps={{
          opacity: 0.15
        }}
        scrollAreaComponent={ScrollArea.Autosize}
        className="mod-panel-explanation"
      >
        {/* <ReactJoyride steps={tutorial_steps} /> */}
        <Flex h="100%" direction="column" gap="xl" justify="space-between">
          <Flex direction="column" gap="sm">
            <Accordion
              defaultValue={openedItems}
              variant="separated"
              multiple
              onChange={setOpenedItems}
            >
              <Accordion.Item
                value="startGame"
                className="mod-panel-start-games-accordion"
              >
                <Accordion.Control>
                  <Title
                    order={titleOrder}
                    className="mod-panel-start-game-explanation"
                  >
                    Spiel starten
                  </Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button.Group orientation="vertical">{gameBtns}</Button.Group>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item
                value="views"
                className="mod-panel-change-scene-accordion"
              >
                <Accordion.Control>
                  <Title
                    order={titleOrder}
                    className="mod-panel-scene-explanation"
                  >
                    Ansichten
                  </Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button.Group orientation="vertical">
                    <Button
                      {...btnVariantDefault}
                      onClick={() => changeView(RoomView.EMPTY)}
                    >
                      Leer
                    </Button>
                    <Button
                      {...btnVariantDefault}
                      onClick={() => changeView(RoomView.SCOREBOARD)}
                    >
                      Scoreboard
                    </Button>
                  </Button.Group>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item
                value="actions"
                className="mod-panel-actions-accordion"
              >
                <Accordion.Control>
                  <Title order={titleOrder}>Aktionen</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button.Group orientation="vertical">
                    <Button
                      {...btnVariantDefault}
                      onClick={() => startTimer()}
                      disabled={isTimerActive}
                    >
                      {roomConfig.modPanel.actions.timerSeconds}s Timer starten
                    </Button>
                    <Button {...btnVariantDefault} onClick={toggleNotefields}>
                      Notizfelder{" "}
                      {atLeastOneNotefieldIsActive
                        ? "ausblenden"
                        : "einblenden"}
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
                      onClick={toggleBuzzerLockState}
                      disabled={isOneScorebarTimerActive}
                    >
                      Alle Buzzer{" "}
                      {areAllBuzzersLocked ? "entsperren" : "sperren"}
                    </Button>
                    <Button
                      {...btnVariantDefault}
                      onClick={hideAnswer}
                      disabled={!room.context.answerState.isAnswerDisplayed}
                    >
                      Antwort ausblenden
                    </Button>
                    <Button {...btnVariantDefault} disabled>
                      Konfetti regnen lassen
                    </Button>
                  </Button.Group>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item
                value="sounds"
                className="mod-panel-sounds-accordion"
              >
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
