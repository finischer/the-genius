export type TSongMap = {
  [index in TSongId]: TSongInfo;
};

export type TSongInfo = {
  id: TSongId;
  title: string;
  interpret: string;
  sprite: TSpriteArray;
};

type TSpriteArray = [number, number];

export type TMusicSpriteMap = {
  lightsDisappear: TSpriteArray;
  violation: TSpriteArray;
  waitingRoom: TSpriteArray;
};

export type TSongId = keyof TMusicSpriteMap;
