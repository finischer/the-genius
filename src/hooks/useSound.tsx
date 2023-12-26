import useSoundPackage from "use-sound";

type TSounds =
  | "buzzer"
  | "winning"
  | "gameIntro"
  | "bell"
  | "shimmer"
  | "typewriter"
  | "warningBuzzer"
  | "bass";

type TSoundSpriteMap = {
  [key in TSounds]: [number, number];
};

// sprite = [start, length]
const sounds: TSoundSpriteMap = {
  buzzer: [0, 300],
  winning: [0, 300],
  gameIntro: [0, 300],
  bell: [0, 300],
  shimmer: [0, 300],
  typewriter: [0, 300],
  warningBuzzer: [0, 300],
  bass: [0, 300],
};

const useSound = () => {
  const [play, { stop }] = useSoundPackage("/static/audio/sound_sprites.mp3", {
    sprite: sounds,
    interrupt: true,
  });

  const emitPlaySound = (soundId: TSounds) => {};

  return { play, stop, emitPlaySound };
};

export default useSound;
