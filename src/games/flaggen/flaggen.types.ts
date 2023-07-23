export type TCountry = {
  country: string;
  shortCode: string;
};

export type TFlaggenDisplayState = {
  country: boolean;
  answer: boolean;
};

export interface IFlaggenState {
  countries: TCountry[];
  qIndex: number;
  display: TFlaggenDisplayState;
}
