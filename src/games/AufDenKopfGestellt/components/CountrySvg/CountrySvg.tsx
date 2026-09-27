import React from "react";
import type { TCountry } from "../../aufDenKopfGestellt.data";
import type { TDrawAnimState } from "../../aufDenKopfGestellt.types";
import classes from "./CountrySvg.module.css";

export interface ICountrySvgProps {
  country: TCountry;
  isRotated: boolean;
  /** Current draw-animation state */
  animState: TDrawAnimState;
  /** Path length measured via getTotalLength() – pass 0 until measured */
  pathLength: number;
  /** Seconds for the draw animation (default 15) */
  durationSeconds?: number;
  /**
   * Increment this to remount the <path> element and restart the animation
   * from the beginning on the same country.
   */
  animKey?: number;
  /**
   * Controls fill visibility in the "done" state.
   * - undefined (default): fill is shown as soon as animState === "done"
   * - true/false: explicit override (used by the game to delay fill until
   *   after the 180° rotation completes)
   */
  showFill?: boolean;
  /**
   * When set, the animation starts from this dashoffset instead of pathLength.
   * Used for fast-resolve: animation continues from where it was paused.
   */
  resolveFromDashoffset?: number;
  /** Ref forwarded to the <path> element so the parent can call getTotalLength() */
  pathRef?: React.RefObject<SVGPathElement>;
  onAnimationEnd?: () => void;
  /** Extra className applied to the <svg> element – use for sizing */
  svgClassName?: string;
  /** Extra inline styles applied to the <svg> element – use for sizing */
  svgStyle?: React.CSSProperties;
}

const CountrySvg: React.FC<ICountrySvgProps> = ({
  country,
  isRotated,
  animState,
  pathLength,
  durationSeconds = 15,
  animKey = 0,
  showFill,
  resolveFromDashoffset,
  pathRef,
  onAnimationEnd,
  svgClassName,
  svgStyle
}) => {
  const isAnimating = animState === "running" || animState === "paused";
  const hasMeasuredPath = pathLength > 0;

  // Starting dashoffset: use resolveFromDashoffset when continuing mid-animation,
  // otherwise start from the full path length (beginning of the draw).
  const startDashoffset =
    resolveFromDashoffset !== undefined && resolveFromDashoffset > 0
      ? resolveFromDashoffset
      : pathLength;

  // @keyframes: starts from current position (startDashoffset) to fully drawn.
  // Fill is NOT part of the animation – controlled separately via showFill.
  const dynamicKeyframe =
    isAnimating && hasMeasuredPath
      ? `@keyframes drawCountry-${animKey} {
          from { stroke-dashoffset: ${startDashoffset}px; fill-opacity: 0; }
          to   { stroke-dashoffset: 0px;                  fill-opacity: 0; }
        }`
      : "";

  let pathStyle: React.CSSProperties;

  if (isAnimating && !hasMeasuredPath) {
    // Not yet measured – keep fully invisible to avoid any flash
    pathStyle = { fillOpacity: 0, stroke: "transparent" };
  } else if (isAnimating) {
    pathStyle = {
      strokeDasharray: `${pathLength}px`,
      strokeDashoffset: `${startDashoffset}px`, // hide until animation overrides
      animationName: `drawCountry-${animKey}`,
      animationDuration: `${durationSeconds}s`,
      animationTimingFunction: "linear",
      animationFillMode: "forwards",
      animationPlayState: animState === "paused" ? "paused" : "running"
    };
  } else if (animState === "done") {
    // showFill=undefined → default: show fill; explicit boolean overrides
    const fill = showFill ?? true;
    pathStyle = { fillOpacity: fill ? 1 : 0 };
  } else {
    // idle – show the static silhouette by default (Konfigurator preview).
    // If showFill=false, hide both fill AND stroke to prevent any flash during
    // brief Yjs propagation windows (stroke-dashoffset defaults to 0 otherwise,
    // which would show the full completed outline for one frame).
    pathStyle =
      showFill === false
        ? { fillOpacity: 0, stroke: "transparent" }
        : { fillOpacity: 1 };
  }

  return (
    <>
      {dynamicKeyframe && <style>{dynamicKeyframe}</style>}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={country.viewBox}
        className={`${classes.svg}${svgClassName ? ` ${svgClassName}` : ""}`}
        style={{
          strokeWidth: country.strokeWidth,
          transform: isRotated ? "rotate(0deg)" : "rotate(180deg)",
          ...svgStyle
        }}
      >
        <path
          key={animKey}
          ref={pathRef}
          className={classes.path}
          style={pathStyle}
          d={country.svg}
          onAnimationEnd={onAnimationEnd}
        />
      </svg>
    </>
  );
};

export default CountrySvg;
