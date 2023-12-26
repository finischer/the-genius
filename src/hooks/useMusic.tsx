import useSound from "use-sound";
import type { TMusicSpriteMap, TSongId, TSongMap } from "~/components/room/MediaPlayer/mediaPlayer.types";
import { useRoom } from "./useRoom";
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

const useMusic = () => {
  const { room } = useRoom();

  const musicState = room?.state.music;
  const musicTitle: TSongId = (musicState?.title as TSongId) || "lightsDisappear";

  const songInfo = songInformationMap[musicTitle];
  const isPlaying = musicState?.isActive === undefined ? false : musicState.isActive;

  const [play, { pause, stop }] = useSound("/static/audio/music_sprites.mp3", {
    sprite: musicSprite,
    loop: true,
    interrupt: true,
  });

  const emitPlayMusic = ({ songId }: { songId: TSongId }) => {
    socket.emit("playMusic", { songId });
  };

  const emitPauseMusic = () => {
    socket.emit("pauseMusic");
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

  return {
    emitPlayMusic,
    emitPauseMusic,
    play,
    pause,
    stop,
    isPlaying,
    songInfo,
    playNextSong,
    playPreviousSong,
  };
};

export default useMusic;
