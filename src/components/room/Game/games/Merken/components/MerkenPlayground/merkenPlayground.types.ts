export interface IMerkenPlaygroundProps {
  cards: string[];
  openCards?: number[]; // elements are indices of cards
  allCardsFlipped?: boolean;
}