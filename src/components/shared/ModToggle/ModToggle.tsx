import { Box, type BoxProps } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import React from "react";
import useComponentVisibility from "~/hooks/useComponentVisibility";
import { useUser } from "~/hooks/useUser";
import Tooltip from "../Tooltip";

interface ModToggleBaseProps extends Omit<BoxProps, "children"> {
  /** Human-readable label shown in the tooltip, e.g. "Wörter", "Codelist" */
  label: string;
  children: React.ReactNode;
}

interface ModToggleUncontrolledProps extends ModToggleBaseProps {
  /** Stable unique ID — used as the key in room.context.componentVisibility */
  id: string;
  /** Whether the component should be visible by default before any toggle */
  defaultVisible?: boolean;
  visible?: never;
  onToggle?: never;
}

interface ModToggleControlledProps extends ModToggleBaseProps {
  id?: never;
  defaultVisible?: never;
  /** Controlled visibility state — managed externally (e.g. via game.display.*) */
  visible: boolean;
  /** Called when the moderator clicks the badge */
  onToggle: () => void;
}

type ModToggleProps = ModToggleUncontrolledProps | ModToggleControlledProps;

/**
 * Generic wrapper that gives the moderator a small eye-icon badge (top-left corner)
 * to toggle visibility of any UI element for all connected clients.
 *
 * Two modes:
 * - Uncontrolled (default): pass `id` — state lives in room.context.componentVisibility
 * - Controlled: pass `visible` + `onToggle` — state managed by the caller
 *
 * - Moderator: always sees the content (dimmed when hidden) + corner toggle badge
 * - Players / spectators: see content only when visible === true
 */
const ModToggle: React.FC<ModToggleProps> = ({ label, children, ...props }) => {
  const { isHost } = useUser();

  // Controlled mode: caller owns the state
  const isControlled = "visible" in props && props.visible !== undefined;

  // Uncontrolled mode: state from Yjs via useComponentVisibility.
  // The hook is always called to satisfy Rules of Hooks — it's a no-op when controlled.
  const uncontrolledId = !isControlled && "id" in props ? props.id : "__noop__";
  const defaultVisible =
    !isControlled && "defaultVisible" in props ? props.defaultVisible : false;
  const { visible: uncontrolledVisible, toggle: uncontrolledToggle } =
    useComponentVisibility(uncontrolledId, defaultVisible);

  const visible = isControlled
    ? (props as ModToggleControlledProps).visible
    : uncontrolledVisible;
  const toggle = isControlled
    ? (props as ModToggleControlledProps).onToggle
    : uncontrolledToggle;

  // Strip our custom props before spreading onto Box
  const boxProps = Object.fromEntries(
    Object.entries(props).filter(
      ([k]) => !["id", "defaultVisible", "visible", "onToggle"].includes(k)
    )
  ) as BoxProps;

  return (
    <Box pos="relative" {...boxProps}>
      {isHost && (
        <Tooltip
          label={`${label} ${visible ? "ausblenden" : "einblenden"}`}
          position="top-start"
        >
          <Box
            onClick={toggle}
            pos="absolute"
            top={-12}
            left={-12}
            w={24}
            h={24}
            style={(theme) => ({
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.sm,
              cursor: "pointer",
              backgroundColor: visible
                ? "var(--mantine-color-green-filled)"
                : "var(--mantine-color-dark-4)",
              color: "white",
              transition: "background-color 150ms ease"
            })}
          >
            {visible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
          </Box>
        </Tooltip>
      )}

      <Box
        opacity={isHost ? (visible ? 1 : 0.35) : visible ? 1 : 0}
        onClick={isHost ? toggle : undefined}
        style={{
          transition: "opacity 200ms",
          cursor: isHost ? "pointer" : undefined,
          pointerEvents: !isHost && !visible ? "none" : undefined
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ModToggle;
