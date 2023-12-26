import type { RoomSounds } from "@prisma/client";
import useSoundPackage from "use-sound";
import { socket } from "./useSocket";

type TSoundSpriteMap = {
  [key in keyof RoomSounds]: [number, number];
};

// sprite = [start, length]
const sounds: TSoundSpriteMap = {
  bass: [0, 1137],
  bell: [1500, 812],
  buzzer: [2500, 1259],
  // dart: [4000, 452],
  // pop: [4500, 75],
  shimmer: [5000, 2045],
  intro: [7500, 7581],
  typewriter: [15500, 473],
  warningBuzzer: [16000, 5490],
  whoosh_1: [22000, 224],
  // whoosh_2: [22500, 224],
  winning: [23000, 3523],
};

const useSound = () => {
  const [play, { stop }] = useSoundPackage("/static/audio/sound_sprites.mp3", {
    sprite: sounds,
    onEnd: () => {
      console.log("Sound ends");
    },
  });

  const emitPlaySound = (soundId: keyof RoomSounds) => {
    socket.emit("playSound", { soundId });
  };

  return { play, stop, emitPlaySound };
};

export default useSound;
