import { Flex, Text } from "@mantine/core";
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import type { TMusicSpriteMap, TSongId, TSongInfo, TSongMap } from "./mediaPlayer.types";

const songInformationMap: TSongMap = {
  violation: {
    id: "violation",
    title: "Violation",
    interpret: "Ethan Sloan",
    sprite: [65000, 77000],
  },
  waitingRoom: {
    id: "waitingRoom",
    title: "Waiting Room",
    interpret: "Ethan Sloan",
    sprite: [150000, 94000],
  },
  lightsDisappear: {
    id: "lightsDisappear",
    title: "Lights disappear",
    interpret: "Christian Andersen",
    sprite: [0, 64000],
  },
};

const getSong = (songId: TSongId) => {
  return songInformationMap[songId];
};

const musicSprite: TMusicSpriteMap = {
  lightsDisappear: songInformationMap.lightsDisappear.sprite,
  violation: songInformationMap.violation.sprite,
  waitingRoom: songInformationMap.waitingRoom.sprite,
};

const MediaPlayer = () => {
  const [currSong, setCurrSong] = useState<TSongInfo>(getSong("lightsDisappear"));
  const [isPlaying, setIsPlaying] = useState(false);

  const [play, { pause, stop }] = useSound("/static/audio/music_sprites.mp3", {
    sprite: musicSprite,
    loop: true,
    interrupt: true,
  });

  useEffect(() => {
    if (isPlaying) {
      play({ id: currSong.id });
    }

    return () => stop();
  }, [currSong, isPlaying]);

  const PlayIcon = isPlaying ? IconPlayerPause : IconPlayerPlay;

  const toggleMusic = () => {
    setIsPlaying((oldValue) => !oldValue);

    if (isPlaying) {
      pause();
    } else {
      play({ id: currSong.id });
    }
  };

  const playMusicById = (songId: TSongId) => {
    setIsPlaying(true);
    setCurrSong(getSong(songId));
  };

  const playNextSong = () => {
    const allSongIds = Object.keys(songInformationMap) as TSongId[];

    const currIndex = allSongIds.findIndex((s) => s === currSong.id);

    let newIndex = currIndex + 1;

    if (newIndex >= allSongIds.length) newIndex = 0;

    const newSong = allSongIds[newIndex] as TSongId;

    playMusicById(newSong);
  };

  const playPreviousSong = () => {
    const allSongIds = Object.keys(songInformationMap) as TSongId[];

    const currIndex = allSongIds.findIndex((s) => s === currSong.id);

    let newIndex = currIndex - 1;

    if (newIndex <= 0) newIndex = allSongIds.length - 1;

    const newSong = allSongIds[newIndex] as TSongId;

    playMusicById(newSong);
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
        <Text weight="bold">{currSong.title}</Text>
        <Text
          weight="bold"
          color="dimmed"
        >
          {currSong.interpret}
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
