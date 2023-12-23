import { Flex, Text } from "@mantine/core";
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import useMusic from "~/hooks/useMusic";

const MediaPlayer = () => {
  const { playMusic, songInfo, pauseMusic, isPlaying, playNextSong, playPreviousSong } = useMusic();

  const PlayIcon = isPlaying ? IconPlayerPause : IconPlayerPlay;

  const toggleMusic = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic(songInfo.id);
    }
  };

  return (
    <Flex
      bg="gray"
      px="md"
      py="xs"
      direction="column"
      gap="sm"
      sx={(theme) => ({
        borderRadius: theme.radius.md,
      })}
    >
      <Flex direction="column">
        <Text weight="bold">{songInfo.title}</Text>
        <Text
          weight="bold"
          color="dimmed"
        >
          {songInfo.interpret}
        </Text>
      </Flex>

      <Flex
        gap="md"
        align="center"
        bg="dark"
        py="xs"
        sx={(theme) => ({
          borderRadius: theme.radius.lg,
        })}
        justify="center"
      >
        <IconPlayerSkipBack onClick={playPreviousSong} />
        <PlayIcon onClick={toggleMusic} />
        <IconPlayerSkipForward onClick={playNextSong} />
      </Flex>
    </Flex>
  );
};

export default MediaPlayer;
