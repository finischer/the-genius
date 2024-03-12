import { Textarea, type TextareaProps } from "@mantine/core";
import { motion } from "framer-motion";
import React from "react";
import type { Player } from "~/types/gameshow.types";
import { animations } from "~/utils/animations";

interface INotefieldProps extends TextareaProps {
  player: Player;
}

const Notefield: React.FC<INotefieldProps> = ({ player, value, ...props }) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    player.context.notefield.value = e.target.value;
  };

  return (
    <motion.div {...animations.fadeInOut}>
      <Textarea
        label={player?.name || " "}
        w="100%"
        rows={9}
        onChange={handleValueChange}
        {...props}
        value={player.context.notefield.value}
      />
    </motion.div>
  );
};

export default Notefield;
