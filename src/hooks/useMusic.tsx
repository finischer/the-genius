import React, { useState, type FC } from "react";
import useSound from "use-sound";
import type { TMusicSpriteMap, TSongId, TSongMap } from "~/components/room/MediaPlayer/mediaPlayer.types";
import { socket } from "./useSocket";

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

const musicSprite: TMusicSpriteMap = {
  lightsDisappear: songInformationMap.lightsDisappear.sprite,
  violation: songInformationMap.violation.sprite,
  waitingRoom: songInformationMap.waitingRoom.sprite,
};

const useMusic = (
  { socketMode }: { socketMode?: boolean } = {
    socketMode: true,
  }
) => {
  const [songInfo, setSongInfo] = useState(songInformationMap.lightsDisappear);
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, stop: stopMusic }] = useSound("/static/audio/music_sprites.mp3", {
    sprite: musicSprite,
    loop: true,
    interrupt: true,
  });

  const playMusic = (songId: TSongId) => {
    setSongInfo(songInformationMap[songId]);

    if (!socketMode) {
      // trigger music dirctly on client side
      play({ id: songId });
    }
    setIsPlaying(true);

    if (!socketMode) return;

    // trigger music via sockets
    socket.emit("playMusic", { songId });
  };

  const pauseMusic = () => {
    setIsPlaying(false);
    pause();
  };

  const playNextSong = () => {
    const allSongIds = Object.keys(songInformationMap) as TSongId[];

    const currIndex = allSongIds.findIndex((s) => s === songInfo.id);

    let newIndex = currIndex + 1;

    if (newIndex >= allSongIds.length) newIndex = 0;

    const newSong = allSongIds[newIndex] as TSongId;

    playMusic(newSong);
  };

  const playPreviousSong = () => {
    const allSongIds = Object.keys(songInformationMap) as TSongId[];

    const currIndex = allSongIds.findIndex((s) => s === songInfo.id);

    let newIndex = currIndex - 1;

    if (newIndex <= 0) newIndex = allSongIds.length - 1;

    const newSong = allSongIds[newIndex] as TSongId;

    playMusic(newSong);
  };

  return { playMusic, pauseMusic, isPlaying, songInfo, playNextSong, playPreviousSong };
};

export default useMusic;
