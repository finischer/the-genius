import { Flex } from "@mantine/core";

const Section = ({ children }: { children: React.ReactNode }) => (
  <Flex
    direction="column"
    gap="xs"
    mt="xl"
    sx={{
      ":first-of-type": {
        marginTop: 0,
      },
    }}
  >
    {children}
  </Flex>
);

export default Section