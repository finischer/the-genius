import React, { useEffect } from "react";
import type { IReferatBingoGameProps } from "./referatBingo.types";

const ReferatBingoGame: React.FC<IReferatBingoGameProps> = ({ game }) => {
  useEffect(() => {
    console.log(game);
  }, []);

  return <div data-testid="game-referat-bingo">ReferatBingoGame</div>;
};

export default ReferatBingoGame;
