import type { RoomSounds } from "@prisma/client";
import path from "path";
import { useEffect, useState } from "react";
import { socket } from "./useSocket";

type TSoundId = keyof RoomSounds;

type TAudioOption = {
  volume: number;
};

type TSoundPaths = {
  [key in TSoundId]: string;
};

type TAudioSound = {
  id: TSoundId;
  audio: HTMLAudioElement;
};

type TAudioEvent = "playSound" | "stopSound";

export const BASE_SOUND_PATH = "/static/audio/sound_effects";
export const BASE_MUSIC_PATH = "/static/audio/music";

const SOUND_PATHS: TSoundPaths = {
  bass: path.join(BASE_SOUND_PATH, "bass.mp3"),
  buzzer: path.join(BASE_SOUND_PATH, "buzzerSound_1.mp3"),
  bell: path.join(BASE_SOUND_PATH, "bell_1.mp3"),
  intro: path.join(BASE_MUSIC_PATH, "titleSong.mp3"),
  shimmer: path.join(BASE_SOUND_PATH, "shimmer_sound_1.mp3"),
  typewriter: path.join(BASE_SOUND_PATH, "typewriter_1.mp3"),
  warningBuzzer: path.join(BASE_SOUND_PATH, "warning_buzzer.mp3"),
  whoosh_1: path.join(BASE_SOUND_PATH, "whoosh_1.mp3"),
  winning: path.join(BASE_SOUND_PATH, "winningSound.mp3"),
};

function audioIsPlaying(audio: HTMLAudioElement) {
  return !audio.paused || audio.currentTime > 0;
}

const useAudio = () => {
  const [audioList, setAudioList] = useState<TAudioSound[]>([]);

  useEffect(() => {
    for (const [soundId, path] of Object.entries(SOUND_PATHS)) {
      const newElem: TAudioSound = {
        id: soundId as TSoundId,
        audio: new Audio(path),
      };
      setAudioList((oldState) => [...oldState, newElem]);
    }

    return () => setAudioList([]);
  }, []);

  function playAudio(soundId: TSoundId) {
    const elem = audioList.find((a) => a.id === soundId);
    if (!elem) return;

    elem.audio.load();
    elem.audio.play();
  }

  function updateAudioOption<T extends keyof TAudioOption>(option: T, value: TAudioOption[T]) {
    // audioList.forEach(a => {
    // })
  }

  function triggerAudioEvent(event: TAudioEvent, soundId: TSoundId) {
    socket.emit(event, { soundId });
  }

  function stopAllAudio() {
    audioList.forEach((a) => {
      a.audio.pause();
      a.audio.currentTime = 0;
    });
  }

  function stopAudio(soundId: TSoundId) {
    const elem = audioList.find((a) => a.id === soundId);
    if (!elem) return;
    elem.audio.pause();
    elem.audio.currentTime = 0;
  }

  return { playAudio, audioList, updateAudioOption, stopAudio, stopAllAudio, triggerAudioEvent };
};

export default useAudio;
