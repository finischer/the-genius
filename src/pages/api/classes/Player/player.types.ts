export type TNotefield = {
  isActive: boolean;
  value: string;
};

export type TPlayerStates = {
  notefield: TNotefield;
};

export interface IPlayer {
  id: string;
  userId: string;
  teamId: string;
  name: string | null;
  states: TPlayerStates;
}
