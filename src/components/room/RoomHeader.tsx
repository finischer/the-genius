import { Box, Flex } from "@mantine/core";
import Timer from "./Timer";

const RoomHeader = () => {
  return (
    <Box h={125}>
      <Flex
        w="100%"
        justify="center"
        pos="absolute"
        top={0}
      >
        <Timer />
      </Flex>
    </Box>
  );
};

export default RoomHeader;
