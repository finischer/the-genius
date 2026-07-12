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

  const areNotefieldsActive = players.some(
    (player) => player.context.notefield.isActive
  );

  const toggleNotefields = () => {
    const nextState = !areNotefieldsActive;
    players.forEach((player) => {
      player.context.notefield.isActive = nextState;
    });
  };

  return { enableAllNotefields, disableAllNotefields, toggleNotefields };
};

export default useNotefield;
