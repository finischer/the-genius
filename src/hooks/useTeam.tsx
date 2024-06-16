import { initPlayer } from "~/config/store";
import useSyncedRoom from "./useSyncedRoom";
import { filterArray } from "@syncedstore/core";
import { useUser } from "./useUser";
import type { Team } from "~/types/gameshow.types";

const useTeam = () => {
  const room = useSyncedRoom();
  const { user } = useUser();
  const myTeam = getTeamOfUser(user.id);

  /**
   * Adds a user to a team if the user is not already a member of a team.
   * If the team does not exist or the user is already in a team, an appropriate message is logged.
   *
   * @param userId - The unique ID of the user.
   * @param username - The username of the user.
   * @param teamId - The unique ID of the team the user wants to join.
   * @returns The ID of the team the user joined, or undefined if the user is already in a team or the team does not exist.
   */
  const joinTeam = (userId: string, username: string, teamId: string): string | undefined => {
    if (getTeamOfUser(userId)) {
      console.log("User is already in a team");
      return;
    }

    const team = getTeamById(teamId);
    if (!team) {
      console.log("Team does not exist: ", teamId);
      return;
    }

    const player = initPlayer(userId, username, teamId);

    team.players.push(player);

    return team.id;
  };

  /**
   * Removes a user from their current team if the user is a member of a team.
   * If the user is not a member of any team, an appropriate message is logged.
   *
   * @param userId - The unique ID of the user.
   * @returns The ID of the team the user left, or undefined if the user is not a member of any team.
   */
  const leaveTeam = (userId: string): string | undefined => {
    const team = getTeamOfUser(userId);
    if (!team) {
      console.log("User is not a player in a team");
      return;
    }

    filterArray(team.players, (player) => player.userId !== userId);
    return team.id;
  };

  /**
   * Retrieves the team based on its unique ID.
   *
   * @param teamId - The unique ID of the team being searched for.
   * @returns The team object with the specified ID or undefined if no team with the specified ID is found.
   */
  const getTeamById = (teamId: string): Team | undefined => {
    const teamList = Object.values(room.teams);
    return teamList.find((team) => team.id === teamId);
  };

  /**
   * Retrieves the team to which the user belongs.
   *
   * @param userId - The unique ID of the user.
   * @returns The team object to which the user belongs, or undefined if the user is not a member of any team.
   */
  function getTeamOfUser(userId: string): Team | undefined {
    const teamList = Object.values(room.teams);
    return teamList.find((team) => team.players.flatMap((player) => player.userId).includes(userId));
  }

  /**
   * Checks if the specified team is full (maximum number of players reached).
   *
   * @param teamId - The unique ID of the team.
   * @returns True if the team is full, otherwise false. If the team does not exist, undefined is returned.
   */
  const isTeamFull = (teamId: string): boolean | undefined => {
    const team = getTeamById(teamId);

    if (!team) {
      console.log("Team does not exist: ", teamId);
      return;
    }

    return team.players.length >= 2;
  };

  /**
   * Checks if the user is a member of any team.
   *
   * @returns True if the user is a member of any team, otherwise false.
   */
  const isPlayer = (): boolean => {
    return !!getTeamOfUser(user.id);
  };

  const isPlayersTeam = (teamId: string) => {
    const team = getTeamById(teamId);

    if (!team) {
      console.log("Team does not exist: ", teamId);
      return;
    }

    return team.id === myTeam?.id;
  };

  return {
    joinTeam,
    leaveTeam,
    isTeamFull: !!getTeamOfUser(user.id),
    isPlayer: !!getTeamOfUser(user.id),
    isPlayersTeam,
  };
};

export default useTeam;
