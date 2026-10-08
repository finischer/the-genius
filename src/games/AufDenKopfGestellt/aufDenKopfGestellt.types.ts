import type { IListItem } from "~/components/List/components/ListItem/listItem.types";
import type { TAufDenKopfGestelltGameState } from "./config";
import type { Game } from "../core/types";

export interface IAufDenKopfGestelltGameProps {
  game: TAufDenKopfGestelltGameState;
}

export type TAnimationState = "running" | "paused" | "";

// Unified draw-animation state used by CountrySvg
// "idle"  = not started yet
// "done"  = animation finished, full silhouette visible
export type TDrawAnimState = "idle" | "running" | "paused" | "done";

// Only metadata stored in synced state – SVG data is looked up client-side
export type TSelectedCountry = IListItem<{
  name: string;
  shortName: string;
  durationSeconds: number;
}>;

export interface IAufDenKopfGestelltState {
  identifier: Game.AUF_DEN_KOPF_GESTELLT;
  selectedCountries: TSelectedCountry[];
  indexOfCountry: number;
  animation: {
    isDone: boolean;
    state: TAnimationState;
  };
  showCountry: boolean;
  showAnswer: boolean;
  answer: string;
  rotateCountry: boolean;
  /** Becomes true ~1.5s after animation ends (after the 180° rotation completes) */
  fillCountry: boolean;
  /** True while the moderator triggered a fast-resolve (after a buzzer) */
  resolving: boolean;
  /**
   * Incremented each time the animation should restart from the beginning
   * (e.g. on resolve). Synced via Yjs so all clients restart simultaneously.
   */
  animKey: number;
  /**
   * When resolving, the stroke-dashoffset at the moment the animation was
   * paused – so the fast animation continues from that point, not the start.
   */
  resolveFromDashoffset: number;
}
