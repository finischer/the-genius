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

export const isBuzzRequest = (value: unknown): value is TBuzzRequest =>
  typeof value === "object" &&
  value !== null &&
  (value as TBuzzRequest).type === "buzz" &&
  typeof (value as TBuzzRequest).teamId === "string";

export const isBuzzResult = (value: unknown): value is TBuzzResult =>
  typeof value === "object" &&
  value !== null &&
  (value as TBuzzResult).type === "buzz-result" &&
  typeof (value as TBuzzResult).teamId === "string" &&
  typeof (value as TBuzzResult).granted === "boolean";

// y-partykit ignores unknown binary message types but chokes on text frames
// from clients, so buzz requests travel as binary frames with their own type.
const BUZZ_MESSAGE_TYPE = 100;

export const encodeBuzzRequest = (request: TBuzzRequest): Uint8Array => {
  const payload = new TextEncoder().encode(JSON.stringify(request));
  const frame = new Uint8Array(payload.length + 1);
  frame[0] = BUZZ_MESSAGE_TYPE;
  frame.set(payload, 1);
  return frame;
};

export const decodeBuzzRequest = (
  message: ArrayBuffer | ArrayBufferView
): TBuzzRequest | null => {
  const bytes =
    message instanceof ArrayBuffer
      ? new Uint8Array(message)
      : new Uint8Array(message.buffer, message.byteOffset, message.byteLength);
  if (bytes[0] !== BUZZ_MESSAGE_TYPE) return null;
  try {
    const parsed: unknown = JSON.parse(
      new TextDecoder().decode(bytes.subarray(1))
    );
    return isBuzzRequest(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
