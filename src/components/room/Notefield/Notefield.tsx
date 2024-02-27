import { Textarea, type TextareaProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";
import type Player from "~/pages/api/classes/Player/Player";
import { animations } from "~/utils/animations";

interface INotefieldProps extends TextareaProps {
  player: Player;
}

const Notefield: React.FC<INotefieldProps> = ({ player, value, ...props }) => {
  const { user } = useUser();
  const isMe = user.id === player.userId;

  const [textAreaValue, setTextAreaValue] = useImmer("");
  const [debouncedTxt] = useDebouncedValue(textAreaValue, 200);

  const handleNotefieldChange = (playerId: string, teamId: string, newValue: string) => {
    socket.emit("updateNotefield", { playerId, teamId, newValue });
  };

  useEffect(() => {
    handleNotefieldChange(player.id, player.teamId, debouncedTxt);
  }, [debouncedTxt]);

  return (
    <motion.div {...animations.fadeInOut}>
      <Textarea
        label={player?.name || " "}
        w="100%"
        rows={9}
        onChange={(e) => setTextAreaValue(e.target.value)}
        {...props}
        value={isMe ? textAreaValue : value}
      />
    </motion.div>
  );
};

export default Notefield;
