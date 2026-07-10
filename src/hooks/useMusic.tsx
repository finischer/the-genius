import { useCallback, useEffect, useState } from "react";
import useSound from "use-sound";
import type {
  TSongId,
  TSongMap
} from "~/components/room/MediaPlayer/mediaPlayer.types";
import useSettings from "./useSettings/useSettings";
import useSyncedRoom from "./useSyncedRoom";

/**
 * NOTE: This hook previously used Howler.js sprites to play multiple songs from a single audio file.
 * However, this caused a race condition bug where `self._sprite[sound._sprite]` would be undefined
 * when Howler's rate() function was called, leading to TypeError crashes.
 *
 * Solution: We now use individual MP3 files for each song instead of sprites.
 * This eliminates the sprite-related errors and provides a more stable playback experience.
 */

// Map song IDs to individual file paths
const songFilePaths: Record<TSongId, string> = {
  violation: "/static/audio/music/backgroundMusic_violation.mp3",
  waitingRoom: "/static/audio/music/backgroundMusic_waitingRoom.mp3",
  lightsDisappear: "/static/audio/music/backgroundMusic_lightsDisappear.mp3"
};

const songInformationMap: TSongMap = {
  violation: {
    id: "violation",
    title: "Violation",
    interpret: "Ethan Sloan",
    sprite: [0, 0]
  },
  waitingRoom: {
    id: "waitingRoom",
    title: "Waiting Room",
    interpret: "Ethan Sloan",
    sprite: [0, 0]
  },
  lightsDisappear: {
    id: "lightsDisappear",
    title: "Lights disappear",
    interpret: "Christian Andersen",
    sprite: [0, 0]
  }
};

// Valid song keys
const validSongKeys = Object.keys(songFilePaths) as TSongId[];

// Helper to validate song key
const isValidSongKey = (key: string): key is TSongId => {
  return validSongKeys.includes(key as TSongId);
};

const useMusic = () => {
  const room = useSyncedRoom();
  const { settings } = useSettings();
  const [currentSongId, setCurrentSongId] =
    useState<TSongId>("lightsDisappear");

  const musicState = room.context?.audio.music ?? {
    isActive: false,
    title: "lightsDisappear"
  };

  // Validate and sanitize the music title
  const rawTitle = musicState?.title || "lightsDisappear";
  const musicTitle: TSongId = isValidSongKey(rawTitle)
    ? rawTitle
    : "lightsDisappear";

  const songInfo = songInformationMap[musicTitle];
  const isPlaying =
    musicState?.isActive === undefined ? false : musicState.isActive;

  // Get the file path for the current song
  const songPath = songFilePaths[currentSongId];

  // Use useSound for the current song
  const [play, { pause, stop }] = useSound(songPath, {
    loop: true,
    volume: settings.volume.music / 100,
    playbackRate: 1
  });

  // When musicTitle changes, update the current song and restart playback if needed
  useEffect(() => {
    if (musicTitle !== currentSongId) {
      setCurrentSongId(musicTitle);

      // Stop current song before switching
      if (isPlaying) {
        stop();
      }
    }
  }, [musicTitle, currentSongId, isPlaying, stop]);

  const emitPlayMusic = ({ songId }: { songId: TSongId }) => {
    musicState.isActive = true;
    musicState.title = songId;
  };

  const emitPauseMusic = () => {
    musicState.isActive = false;
  };

  const playNextSong = () => {
    const allSongIds = Object.keys(songInformationMap) as TSongId[];
    const currIndex = allSongIds.findIndex((s) => s === songInfo.id);
    let newIndex = currIndex + 1;
    if (newIndex >= allSongIds.length) newIndex = 0;
    const newSong = allSongIds[newIndex] as TSongId;
    emitPlayMusic({ songId: newSong });
  };

  const playPreviousSong = () => {
    const allSongIds = Object.keys(songInformationMap) as TSongId[];
    const currIndex = allSongIds.findIndex((s) => s === songInfo.id);
    let newIndex = currIndex - 1;
    if (newIndex <= 0) newIndex = allSongIds.length - 1;
    const newSong = allSongIds[newIndex] as TSongId;
    emitPlayMusic({ songId: newSong });
  };

  const safePlay = useCallback(() => {
    play();
  }, [play]);

  const safePause = useCallback(() => {
    pause();
  }, [pause]);

  const safeStop = useCallback(() => {
    stop();
  }, [stop]);

  return {
    emitPlayMusic,
    emitPauseMusic,
    play: safePlay,
    pause: safePause,
    stop: safeStop,
    isPlaying,
    songInfo,
    playNextSong,
    playPreviousSong,
    currentSongId
  };
};

export default useMusic;
