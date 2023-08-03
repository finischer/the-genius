import React from "react";
import { type IMerkenGameProps } from "./merken.types";
import MerkenPlayground from "./components/MerkenPlayground/MerkenPlayground";

const MerkenGame: React.FC<IMerkenGameProps> = ({ game }) => {
  return <div>

    <MerkenPlayground cards={game.cards} />

  </div>;
};

export default MerkenGame;
