import { Flex, Text } from "@mantine/core";
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import ActionIcon from "~/components/shared/ActionIcon";
import useMusic from "~/hooks/useMusic";

const MediaPlayer = () => {
  const { emitPauseMusic, songInfo, emitPlayMusic, isPlaying, playNextSong, playPreviousSong } = useMusic();

  const PlayIcon = isPlaying ? IconPlayerPause : IconPlayerPlay;

  const toggleMusic = () => {
    if (isPlaying) {
      emitPauseMusic();
    } else {
      emitPlayMusic({ songId: songInfo.id });
    }
  };

  return (
    <Flex
      bg="dark.6"
      px="md"
      py="md"
      direction="column"
      gap="sm"
      style={(theme) => ({
        borderRadius: theme.radius.md,
      })}
    >
      <Flex direction="column">
        <Text fw="bold">{songInfo.title}</Text>
        <Text
          fw="bold"
          c="dimmed"
        >
          {songInfo.interpret}
        </Text>
      </Flex>

      <Flex
        gap="md"
        align="center"
        bg="dark.8"
        py="xs"
        style={(theme) => ({
          borderRadius: theme.radius.lg,
        })}
        justify="center"
      >
        <ActionIcon
          toolTip="Vorheriger Titel"
          variant="light"
        >
          <IconPlayerSkipBack onClick={playPreviousSong} />
        </ActionIcon>
        <ActionIcon variant="light">
          <PlayIcon onClick={toggleMusic} />
        </ActionIcon>
        <ActionIcon
          toolTip="Nächster Titel"
          variant="light"
        >
          <IconPlayerSkipForward onClick={playNextSong} />
        </ActionIcon>
      </Flex>
    </Flex>
  );
};

export default MediaPlayer;
