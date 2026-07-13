import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { filterArray } from "@syncedstore/core";
import {
  IconExposureMinus1,
  IconExposurePlus1,
  IconTargetArrow
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import ModView from "~/components/shared/ModView";
import Tooltip from "~/components/shared/Tooltip";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import useTeam from "~/hooks/useTeam";
import { useUser } from "~/hooks/useUser";
import { colors, sizes } from "~/styles/constants";
import { RoomView } from "~/types/gameshow.types";
import { animations } from "~/utils/animations";
import { createRandomUserName } from "~/utils/helpers";
import Notefield from "../Notefield/Notefield";
import ScorebarModMenu, { type TKickTarget } from "./ScorebarModMenu";
import { type IScoreCircleProps, type IScorebarProps } from "./scorebar.types";

const stretchAnimation = undefined;

const HIGHLIGHT_CONTAINER_COLOR = "#c6011f";
const SCOREBAR_HEIGHT = "3rem";
const PULSE_ANIMATION_DURATION_SECONDS = 5;

const ScoreCircle: React.FC<IScoreCircleProps> = ({ filled }) => (
  <Box
    style={() => ({
      height: "2rem",
      width: "2rem",
      background: filled ? colors.success : "transparent",
      borderRadius: "50%",
      border: "1px solid white",
      marginLeft: "0.8rem",
      transition: "background 500ms",
      "&:nthOfType(1)": {
        marginLeft: 0
      }
    })}
  />
);

const Scorebar: React.FC<IScorebarProps> = ({ team, timerPosition }) => {
  const theme = useMantineTheme();
  const [menuOpened, { open: openMenu, close: closeMenu }] =
    useDisclosure(false);
  const [kickTarget, setKickTarget] = useState<TKickTarget | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const teamFn = useTeam();
  const room = useSyncedRoom();

  const { user, isHost, player } = useUser();

  const currGame = room.context.currentGame;

  const scoreCircles = currGame
    ? Array(currGame.maxPoints)
        .fill(null)
        .map((_, index) => (
          <ScoreCircle key={index} filled={team.gameScore > index} />
        ))
    : undefined;

  const scorePoints = (
    <Flex
      px="0.5rem"
      miw="2rem"
      h="2rem"
      style={{
        borderRadius: theme.radius.md,
        border: "1px solid white"
      }}
      justify="center"
      align="center"
    >
      {team.gameScore}
    </Flex>
  );

  const scorebarPoints =
    currGame?.scorebarMode === "circle" ? scoreCircles : scorePoints;

  // const isTeamFull = team.players.length >= room.maxPlayersPerTeam;
  const highlightBoxShadow =
    team.isActiveTurn || team.buzzer.isPressed
      ? `0px 0px 50px 50px ${HIGHLIGHT_CONTAINER_COLOR}`
      : "";
  const scorebarBorderRadius = theme.radius.sm;

  const disableModBtns = room.context.view !== RoomView.GAME;
  const disableIncreaseScoreBtn =
    disableModBtns ||
    (room.context.currentGame
      ? team.gameScore >= room.context.currentGame.maxPoints
      : true);
  const disableDecreaseScoreBtn = disableModBtns || team.gameScore <= 0;

  const playerNamesWhoBuzzered = team.players
    .map((p) => {
      if (p.userId && team.buzzer.playersBuzzered.includes(p.id)) {
        return p.name;
      }

      return undefined;
    })
    .filter((p) => p);

  const scorebarTimerStyle = {
    height: SCOREBAR_HEIGHT,
    width: SCOREBAR_HEIGHT,
    borderRadius: scorebarBorderRadius,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fontSizes.lg
  };

  const increaseGameScore = (step = 1) => {
    if (!currGame || team.gameScore >= currGame?.maxPoints) return;

    team.gameScore += step;
  };

  const decreaseGameScore = (step = 1) => {
    if (team.gameScore <= 0) return;

    team.gameScore -= step;
  };

  const toggleTeamActiveState = () => {
    team.isActiveTurn = !team.isActiveTurn;
    team.buzzer.isPressed = false;
    team.buzzer.playersBuzzered = [];

    // set other teams active state to false
    const otherTeams = Object.values(room.teams).filter(
      (t) => t.id !== team.id
    );
    otherTeams.forEach((t) => {
      t.isActiveTurn = false;
    });
  };

  const handleKickConfirm = () => {
    if (!isHost || !kickTarget) return;
    const stillInTeam = team.players.some(
      (p) => p.userId === kickTarget.userId
    );
    if (!stillInTeam) {
      setKickTarget(null);
      return;
    }
    const kickedName = kickTarget.name;
    filterArray(team.players, (p) => p.userId !== kickTarget.userId);
    setKickTarget(null);
    notifications.show({
      title: "Spieler entfernt",
      message: `${kickedName} wurde entfernt`,
      color: "green"
    });
  };

  const handleResetConfirm = () => {
    if (!isHost) return;
    const teamName = team.name;
    team.gameScore = 0;
    filterArray(team.players, () => false);
    setResetOpen(false);
    notifications.show({
      title: "Team zurückgesetzt",
      message: `${teamName} wurde zurückgesetzt`,
      color: "green"
    });
  };

  const handleRenameCommit = (newName: string) => {
    team.name = newName;
    notifications.show({
      title: "Umbenannt",
      message: `Team heißt jetzt: ${newName}`,
      color: "green"
    });
  };

  return (
    <Flex align="flex-end" gap="lg" pos="relative" className="scorebar">
      {/* Left Scorbar timer */}
      <AnimatePresence>
        {timerPosition === "left" && team.scorebarTimer.active && (
          <motion.div {...animations.fadeInOut}>
            <Container bg={theme.primaryColor} style={scorebarTimerStyle}>
              {team.scorebarTimer.currSeconds}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Only show notefields to own team players, viewers or the host */}
      {(player?.teamId === team.id || !teamFn.isPlayer() || isHost) && (
        <Flex pos="absolute" top={-300} w="100%" gap="md">
          {team.players.map((p) => (
            <AnimatePresence key={p.id}>
              {p.context.notefield.isActive && (
                <Notefield
                  disabled={p.userId !== user.id} // only this player can edit the notefield
                  value={p.context.notefield.value}
                  player={p}
                />
              )}
            </AnimatePresence>
          ))}
        </Flex>
      )}

      <Flex direction="column" pos="relative">
        {/* Highlight container to represent that it is the turn of this team  */}
        <motion.div
          animate={{
            scale: [0.75, 1.25, 0.75]
          }}
          transition={{
            repeat: Infinity,
            duration: PULSE_ANIMATION_DURATION_SECONDS,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "50%",
            boxShadow: highlightBoxShadow,
            WebkitBoxShadow: highlightBoxShadow,
            animationName: stretchAnimation,
            animationDuration: "2s",
            animationTimingFunction: "ease-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationPlayState: "running"
          }}
        />

        <Flex gap="lg" align="flex-end">
          <Menu
            disabled={!isHost}
            closeOnItemClick={false}
            opened={menuOpened}
            onOpen={openMenu}
            onClose={closeMenu}
          >
            <Menu.Target>
              <UnstyledButton
                bg={theme.primaryColor}
                disabled={!isHost}
                style={() => ({
                  minWidth: "20%",
                  maxWidth: "50%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.25rem 1rem",
                  borderRadius: `${scorebarBorderRadius} ${scorebarBorderRadius} 0 0`,
                  fontWeight: "bolder",
                  overflow: "hidden",
                  cursor: isHost ? "pointer" : "auto",
                  span: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                })}
              >
                <span>
                  {team.name} · ({team.players.length}/2)
                </span>
              </UnstyledButton>
            </Menu.Target>
            <ModView>
              <Menu.Dropdown>
                <Menu.Label>Optionen</Menu.Label>
                <ScorebarModMenu
                  team={team}
                  closeMenu={closeMenu}
                  onKickRequest={setKickTarget}
                  onResetRequest={() => setResetOpen(true)}
                  onRenameCommit={handleRenameCommit}
                />
              </Menu.Dropdown>
            </ModView>
          </Menu>
          {!teamFn.isPlayer() && !isHost && !teamFn.isTeamFull(team.id) && (
            <Button
              variant="subtle"
              mb="xs"
              onClick={() =>
                teamFn.joinTeam(
                  user.id,
                  user.username ?? createRandomUserName(),
                  team.id
                )
              }
            >
              Beitreten
            </Button>
          )}

          {teamFn.isPlayersTeam(team.id) && (
            <Button
              variant="subtle"
              mb="xs"
              onClick={() => teamFn.leaveTeam(user.id)}
            >
              Team verlassen
            </Button>
          )}

          <ModView>
            <Group mb="xs" className="scorebar-settings">
              <ActionIcon
                variant="outline"
                disabled={team.scorebarTimer.active}
                toolTip={
                  highlightBoxShadow
                    ? "Buzzer freigeben"
                    : `${team.name} an der Reihe sein lassen`
                }
                onClick={toggleTeamActiveState}
              >
                <IconTargetArrow size={sizes.icon.s} />
              </ActionIcon>
              <ActionIcon
                variant="outline"
                toolTip="Score -1"
                disabled={disableDecreaseScoreBtn}
                onClick={() => decreaseGameScore()}
              >
                <IconExposureMinus1 size={sizes.icon.s} />
              </ActionIcon>
              <ActionIcon
                variant="outline"
                toolTip="Score +1"
                disabled={disableIncreaseScoreBtn}
                onClick={() => increaseGameScore()}
              >
                <IconExposurePlus1 size={sizes.icon.s} />
              </ActionIcon>

              <Flex direction="column" gap="xs" pos="absolute" right={0}>
                {playerNamesWhoBuzzered.map((p, idx) => (
                  <Tooltip key={idx} label="hat gebuzzert">
                    <Badge maw="10rem">{p || `Spieler ${idx + 1}`}</Badge>
                  </Tooltip>
                ))}
              </Flex>
            </Group>
          </ModView>
        </Flex>

        <Flex
          gap="1rem"
          bg={theme.primaryColor}
          h={SCOREBAR_HEIGHT}
          w="30rem"
          style={(theme) => ({
            borderRadius: "0.25rem",
            borderTopLeftRadius: 0,
            boxShadow: theme.shadows.xl
          })}
          p="0.5rem 1rem"
          pos="relative"
        >
          {/* Player names */}
          <Box
            style={() => ({
              width: "50%",
              height: "100%",
              display: "inline-block",
              position: "relative"
            })}
          >
            <Tooltip label={team.players.map((p) => p.name).join(", ")}>
              <Text
                truncate
                lineClamp={1}
                style={() => ({
                  width: "100%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex"
                })}
              >
                {team.players.map((p) => p.name).join("/") || "Keiner da"}
              </Text>
            </Tooltip>
          </Box>

          {/* Score circles */}
          {room.context.view === RoomView.GAME && (
            <Flex w="100%" h="100%" justify="center" align="center">
              {scorebarPoints}
            </Flex>
          )}
        </Flex>
      </Flex>

      {/* Right scorbar timer */}
      <AnimatePresence>
        {timerPosition === "right" && team.scorebarTimer.active && (
          <motion.div {...animations.fadeInOut}>
            <Container bg={theme.primaryColor} style={scorebarTimerStyle}>
              {team.scorebarTimer.currSeconds}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kick confirmation modal — rendered outside the Menu to avoid FocusTrap conflict */}
      <Modal
        opened={kickTarget !== null}
        onClose={() => setKickTarget(null)}
        title="Spieler entfernen"
        size="sm"
        yOffset="10vh"
      >
        <Stack gap="md">
          <Text>
            Möchtest du <strong>{kickTarget?.name}</strong> wirklich aus dem
            Team entfernen?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setKickTarget(null)}>
              Abbrechen
            </Button>
            <Button color="red" onClick={handleKickConfirm}>
              Bestätigen
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Reset confirmation modal — rendered outside the Menu to avoid FocusTrap conflict */}
      <Modal
        opened={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Team zurücksetzen"
        size="sm"
        yOffset="10vh"
      >
        <Text mb="sm">
          Bist du sicher, dass du <strong>{team.name}</strong> zurücksetzen
          möchtest?
        </Text>
        <Text size="sm" c="dimmed" mb="xs">
          Folgende Änderungen werden vorgenommen:
        </Text>
        <Text size="sm" mb="xs">
          • Score wird auf 0 zurückgesetzt
        </Text>
        <Text size="sm" mb="lg">
          • Alle Spieler werden aus dem Team entfernt
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setResetOpen(false)}>
            Abbrechen
          </Button>
          <Button color="red" onClick={handleResetConfirm}>
            Zurücksetzen
          </Button>
        </Group>
      </Modal>
    </Flex>
  );
};

export default Scorebar;
