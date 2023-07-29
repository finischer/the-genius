import React from "react";
import { type IMerkenGameProps } from "./merken.types";

const MerkenGame: React.FC<IMerkenGameProps> = ({ game }) => {
  return <div>{game.name}</div>;
};

export default MerkenGame;
