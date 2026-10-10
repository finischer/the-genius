import { Flex } from "@mantine/core";
import classes from "./Section.module.css";

const Section = ({ children }: { children: React.ReactNode }) => (
  <Flex direction="column" gap="xs" mt="xl" className={classes.section}>
    {children}
  </Flex>
);

export default Section;
