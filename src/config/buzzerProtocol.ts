export type TBuzzRequest = {
  type: "buzz";
  teamId: string;
};

export type TBuzzResult = {
  type: "buzz-result";
  teamId: string;
  granted: boolean;
};

// Presses of different teams within this window count as simultaneous, so the
// server picks the first one. Later presses are handled by the room state.
export const BUZZ_CLAIM_WINDOW_MS = 300;

const isBuzzRequest = (value: unknown): value is TBuzzRequest =>
  typeof value === "object" &&
  value !== null &&
  (value as TBuzzRequest).type === "buzz" &&
  typeof (value as TBuzzRequest).teamId === "string";

const isBuzzResult = (value: unknown): value is TBuzzResult =>
  typeof value === "object" &&
  value !== null &&
  (value as TBuzzResult).type === "buzz-result" &&
  typeof (value as TBuzzResult).teamId === "string" &&
  typeof (value as TBuzzResult).granted === "boolean";

const parseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const parseBuzzRequest = (raw: string): TBuzzRequest | null => {
  const parsed = parseJson(raw);
  return isBuzzRequest(parsed) ? parsed : null;
};

export const parseBuzzResult = (raw: string): TBuzzResult | null => {
  const parsed = parseJson(raw);
  return isBuzzResult(parsed) ? parsed : null;
};
