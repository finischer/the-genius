// Minimal types needed for buzzer logic testing and pure function operations.
// These mirror the relevant fields from the full Room/Team types in gameshow.types.ts.

export interface IBuzzerState {
  isLocked: boolean;
  isPressed: boolean;
  playersBuzzered: string[];
}

export interface ITeamBuzzerState {
  id: string;
  isActiveTurn: boolean;
  buzzer: IBuzzerState;
  scorebarTimer: {
    active: boolean;
    currSeconds: number;
    initSeconds: number;
    id: string | null;
  };
}

export interface IRoomBuzzerState {
  teams: {
    teamOne: ITeamBuzzerState;
    teamTwo: ITeamBuzzerState;
  };
}

export type TeamKey = "teamOne" | "teamTwo";

/**
 * Factory function to create a fresh room buzzer state for testing.
 */
export function createInitialRoomBuzzerState(): IRoomBuzzerState {
  return {
    teams: {
      teamOne: {
        id: "team-one",
        isActiveTurn: false,
        buzzer: {
          isLocked: false,
          isPressed: false,
          playersBuzzered: []
        },
        scorebarTimer: {
          active: false,
          currSeconds: 0,
          initSeconds: 5,
          id: null
        }
      },
      teamTwo: {
        id: "team-two",
        isActiveTurn: false,
        buzzer: {
          isLocked: false,
          isPressed: false,
          playersBuzzered: []
        },
        scorebarTimer: {
          active: false,
          currSeconds: 0,
          initSeconds: 5,
          id: null
        }
      }
    }
  };
}

/**
 * Applies a buzzer press for the given team.
 *
 * Returns unchanged state if:
 * - The team's buzzer is locked
 * - Any team already has an active turn
 */
export function applyBuzzerPress(
  state: IRoomBuzzerState,
  teamId: TeamKey
): IRoomBuzzerState {
  const team = state.teams[teamId];

  if (team.buzzer.isLocked) {
    return state;
  }

  const anyTeamActive = Object.values(state.teams).some((t) => t.isActiveTurn);
  if (anyTeamActive) {
    return state;
  }

  return {
    ...state,
    teams: {
      ...state.teams,
      [teamId]: {
        ...team,
        isActiveTurn: true,
        buzzer: {
          ...team.buzzer,
          isPressed: true
        }
      }
    }
  };
}

/**
 * Releases all buzzers, clearing active turn, pressed state, timer, and
 * playersBuzzered for every team.
 */
export function releaseAllBuzzers(state: IRoomBuzzerState): IRoomBuzzerState {
  const releaseTeam = (team: ITeamBuzzerState): ITeamBuzzerState => ({
    ...team,
    isActiveTurn: false,
    buzzer: {
      ...team.buzzer,
      isPressed: false,
      playersBuzzered: []
    },
    scorebarTimer: {
      ...team.scorebarTimer,
      active: false
    }
  });

  return {
    ...state,
    teams: {
      teamOne: releaseTeam(state.teams.teamOne),
      teamTwo: releaseTeam(state.teams.teamTwo)
    }
  };
}

/**
 * Locks the buzzer for the specified team.
 */
export function lockBuzzer(
  state: IRoomBuzzerState,
  teamId: TeamKey
): IRoomBuzzerState {
  const team = state.teams[teamId];

  return {
    ...state,
    teams: {
      ...state.teams,
      [teamId]: {
        ...team,
        buzzer: {
          ...team.buzzer,
          isLocked: true
        }
      }
    }
  };
}
