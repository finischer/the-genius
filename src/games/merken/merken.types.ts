type TMerkenTimerState = {
  isActive: boolean;
  timeToThinkSeconds: number;
};

export interface IMerkenState {
  timerState: TMerkenTimerState;
  cards: string[]; // path to icon on server side
  openCards: number[]; // array of index which card is open
  allCardsFlipped: boolean; // true if all cards are flipped
}
