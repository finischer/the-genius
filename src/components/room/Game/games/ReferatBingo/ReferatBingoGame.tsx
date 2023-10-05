import React, { useEffect } from "react";
import type { IReferatBingoGameProps } from "./referatBingo.types";

const ReferatBingoGame: React.FC<IReferatBingoGameProps> = ({ game }) => {
  useEffect(() => {
    console.log(game);
  }, []);

  return <div>ReferatBingoGame</div>;
};

export default ReferatBingoGame;
