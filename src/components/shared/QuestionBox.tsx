import { useMantineTheme } from "@mantine/core";
import type { FC, ReactNode } from "react";
import ContainerBox from "./ContainerBox";
import type { IContainerBoxProps } from "./ContainerBox/containerBox.types";

interface IQuestionBoxProps extends IContainerBoxProps {
  children: ReactNode;
  cursor?: "default" | "pointer";
}

const QuestionBox: FC<IQuestionBoxProps> = ({
  children,
  cursor = "default",
  ...props
}) => {
  const theme = useMantineTheme();
  return (
    <ContainerBox
      bg={theme.primaryColor}
      contentCentered
      w="25rem"
      py="1rem"
      px="2rem"
      style={{
        transition: "opacity 300ms",
        wordBreak: "break-word",
        cursor
      }}
      {...props}
    >
      {children}
    </ContainerBox>
  );
};

export default QuestionBox;
