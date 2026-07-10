// General custom types

import type { Y } from "@syncedstore/core";

export type RequiredNonNullableObject<T extends object> = {
  [P in keyof Required<T>]: NonNullable<T[P]>;
};

export type FixedSizeArray<N extends number, T> = N extends 0
  ? never[]
  : {
      0: T;
      length: N;
    } & ReadonlyArray<T>;

export type FunctionToWrap<T extends unknown[]> = (...args: T) => void;

export type YDocMap<T> = Y.Map<T>;
