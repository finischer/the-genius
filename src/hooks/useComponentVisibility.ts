import useSyncedRoom from "./useSyncedRoom";
import { useUser } from "./useUser";

/**
 * Manages the shared visibility state for a toggleable UI component.
 *
 * The state lives in room.context.componentVisibility[id] and is synced
 * across all clients via Yjs/PartyKit. Only the moderator can toggle it;
 * all clients can read it.
 *
 * @param id - Stable unique identifier for this component, e.g. "geheimwoerter-wordlist"
 * @param defaultVisible - Initial visibility when no state exists yet for this id
 */
const useComponentVisibility = (
  id: string,
  defaultVisible = false
): { visible: boolean; toggle: () => void } => {
  const room = useSyncedRoom();
  const { isHost } = useUser();

  const visible = room.context.componentVisibility[id] ?? defaultVisible;

  const toggle = () => {
    if (!isHost) return;
    room.context.componentVisibility[id] = !visible;
  };

  return { visible, toggle };
};

export default useComponentVisibility;
