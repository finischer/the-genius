export interface IMerkenPlaygroundProps {
  cards: string[]; // elements are the path to the icon
  openCards?: number[]; // elements are indices of cards
  allCardsFlipped?: boolean;
  clickable?: boolean;
  onCardClick?: (index: number) => void;
}
