import { Badge, Box, Button, Container, Flex, Group, Text, useMantineTheme } from "@mantine/core";
import { IconExposureMinus1, IconExposurePlus1, IconTargetArrow } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import ActionIcon from "~/components/shared/ActionIcon/ActionIcon";
import Tooltip from "~/components/shared/Tooltip";
import useBuzzer from "~/hooks/useBuzzer/useBuzzer";
import { useRoom } from "~/hooks/useRoom";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";
import { colors, sizes } from "~/styles/constants";
import { animations } from "~/utils/animations";
import Notefield from "../Notefield/Notefield";
import { type IScoreCircleProps, type IScorebarProps } from "./scorebar.types";
import ModView from "~/components/shared/ModView";

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
        marginLeft: 0,
      },
    })}
  />
);

const Scorebar: React.FC<IScorebarProps> = ({ team, timerPosition }) => {
  const theme = useMantineTheme();
  const { activateBuzzer, deactivateBuzzer } = useBuzzer();
  const { room, currentGame } = useRoom();
  const { user, team: userTeam, isHost, isPlayer, setUserAsPlayer } = useUser();

  const scoreCircles = currentGame
    ? Array(currentGame.maxPoints)
        .fill(null)
        .map((_, index) => (
          <ScoreCircle
            key={index}
            filled={team.gameScore > index}
          />
        ))
    : undefined;

  const scorePoints = (
    <Flex
      px="0.5rem"
      miw="2rem"
      h="2rem"
      style={{
        borderRadius: theme.radius.md,
        border: "1px solid white",
      }}
      justify="center"
      align="center"
    >
      {team.gameScore}
    </Flex>
  );

  const scorebarPoints = currentGame?.scorebarMode === "circle" ? scoreCircles : scorePoints;

  const isTeamFull = team.players.length >= room.maxPlayersPerTeam;
  const highlightBoxShadow =
    team.isActiveTurn || team.buzzer.isPressed ? `0px 0px 50px 50px ${HIGHLIGHT_CONTAINER_COLOR}` : "";
  const scorebarBorderRadius = theme.radius.sm;

  const disableModBtns = !room.state.display.game;
  const disableIncreaseScoreBtn = disableModBtns || (currentGame && team.gameScore >= currentGame.maxPoints);
  const disableDecreaseScoreBtn = disableModBtns || team.gameScore <= 0;

  const playerNamesWhoBuzzered = team.players
    .map((p) => {
      if (p.userId && team.buzzer.playersBuzzered.includes(p.userId)) {
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
    fontSize: theme.fontSizes.lg,
  };

  const joinTeam = () => {
    if (isPlayer) return;
    socket.emit("joinTeam", { teamId: team.id, user }, () => {
      setUserAsPlayer(team);
    });
  };

  const increaseGameScore = (step = 1) => {
    if (!currentGame || team.gameScore >= currentGame?.maxPoints) return;
    socket.emit("increaseGameScore", { teamId: team.id, step });
  };

  const decreaseGameScore = (step = 1) => {
    if (team.gameScore <= 0) return;
    socket.emit("decreaseGameScore", { teamId: team.id, step });
  };

  const toggleTeamActiveState = () => {
    socket.emit("toggleTeamActive", { teamId: team.id });
  };

  const handleNotefieldChange = (playerId: string, teamId: string, newValue: string) => {
    socket.emit("updateNotefield", { playerId, teamId, newValue });
  };

  return (
    <Flex
      align="flex-end"
      gap="lg"
      pos="relative"
    >
      {/* Left Scorbar timer */}
      <AnimatePresence>
        {timerPosition === "left" && team.scorebarTimer.isActive && (
          <motion.div {...animations.fadeInOut}>
            <Container
              bg={theme.primaryColor}
              style={scorebarTimerStyle}
            >
              {team.scorebarTimer.seconds}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Only show notefields to own team players or viewers */}
      {(team.id === userTeam?.id || !isPlayer) && (
        <Flex
          pos="absolute"
          top={-300}
          w="100%"
          gap="md"
        >
          {team.players.map((p) => (
            <AnimatePresence key={p.id}>
              {p.states.notefield.isActive && (
                <Notefield
                  disabled={p.userId !== user.id} // only this player can edit the notefield
                  value={p.states.notefield.value}
                  onChange={(e) => handleNotefieldChange(p.id, p.teamId, e.target.value)}
                  player={p}
                  onFocus={deactivateBuzzer}
                  onBlur={activateBuzzer}
                />
              )}
            </AnimatePresence>
          ))}
        </Flex>
      )}

      <Flex
        direction="column"
        pos="relative"
      >
        {/* Highlight container to represent that it is the turn of this team  */}
        <motion.div
          animate={{
            scale: [0.75, 1.25, 0.75],
          }}
          transition={{
            repeat: Infinity,
            duration: PULSE_ANIMATION_DURATION_SECONDS,
            ease: "easeInOut",
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
            animationPlayState: "running",
          }}
        />

        <Flex
          gap="lg"
          align="flex-end"
        >
          <Box
            bg={theme.primaryColor}
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
              span: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            })}
          >
            <span>
              {team.name} · ({team.players.length}/{room.maxPlayersPerTeam})
            </span>
          </Box>
          {!isPlayer && !isHost && !isTeamFull && (
            <Button
              variant="subtle"
              mb="xs"
              onClick={joinTeam}
            >
              Beitreten
            </Button>
          )}

          <ModView>
            <Group mb="xs">
              <ActionIcon
                variant="outline"
                disabled={team.scorebarTimer.isActive}
                toolTip={highlightBoxShadow ? "Buzzer freigeben" : `${team.name} an der Reihe sein lassen`}
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

              <Flex
                direction="column"
                gap="xs"
                pos="absolute"
                right={0}
              >
                {playerNamesWhoBuzzered.map((p, idx) => (
                  <Tooltip
                    key={idx}
                    label="hat gebuzzert"
                  >
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
            boxShadow: theme.shadows.xl,
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
              position: "relative",
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
                  display: "flex",
                })}
              >
                {team.players.map((p) => p.name).join("/") || "Keiner da"}
              </Text>
            </Tooltip>
          </Box>

          {/* Score circles */}
          {room.state.display.game && (
            <Flex
              w="100%"
              h="100%"
              justify="center"
              align="center"
            >
              {scorebarPoints}
            </Flex>
          )}
        </Flex>
      </Flex>

      {/* Right scorbar timer */}
      <AnimatePresence>
        {timerPosition === "right" && team.scorebarTimer.isActive && (
          <motion.div {...animations.fadeInOut}>
            <Container
              bg={theme.primaryColor}
              style={scorebarTimerStyle}
            >
              {team.scorebarTimer.seconds}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default Scorebar;
