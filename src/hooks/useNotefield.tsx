import useSyncedRoom from "./useSyncedRoom";

const useNotefield = () => {
  const room = useSyncedRoom();

  const players = Object.values(room.teams)
    .map((team) => team.players)
    .flat();

  const disableAllNotefields = () => {
    players.forEach((player) => {
      player.context.notefield.isActive = false;
    });
  };

  const enableAllNotefields = () => {
    players.forEach((player) => {
      player.context.notefield.isActive = true;
    });
  };

  const toggleNotefields = () => {
    // TODO: handle if one notefield is not active and other ones are active
    players.forEach((player) => (player.context.notefield.isActive = !player.context.notefield.isActive));
  };

  return { enableAllNotefields, disableAllNotefields, toggleNotefields };
};

export default useNotefield;
