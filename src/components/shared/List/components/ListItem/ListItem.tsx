import { Flex, useMantineTheme } from "@mantine/core";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import React from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import { useRaisedShadow } from "~/hooks/useRaisedShadow";
import type { IListItem, IListItemProps } from "./listItem.types";

const ListItem = <T,>({
  item,
  editable,
  deletable,
  onDelete,
  onClick,
  selected,
  content,
}: IListItemProps<T>) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const controls = useDragControls();
  const theme = useMantineTheme();

  const handleClick = (itemId: string) => {
    if (onClick) {
      onClick(itemId);
    }
  };

  const handleDelete = (e: React.SyntheticEvent) => {
    if (onDelete) {
      onDelete();
      e.stopPropagation();
    }
  };

  return (
    <Reorder.Item
      id={item.id.toString()}
      value={item}
      dragListener={false}
      style={{ boxShadow, y, listStyle: "none", cursor: editable ? "pointer" : "auto" }}
      dragControls={controls}
      onClick={() => handleClick(item.id.toString())}
    >
      <Flex
        bg={selected && editable ? theme.primaryColor : theme.colors.dark[5]}
        style={{ borderRadius: theme.radius.md }}
        px="md"
        py="sm"
        justify="space-between"
      >
        <Flex
          gap="md"
          align="flex-start"
        >
          {deletable && (
            <ActionIcon
              size="sm"
              toolTip="Antwort löschen"
              onClick={handleDelete}
            >
              <IconX />
            </ActionIcon>
          )}
          <span>{content}</span>
        </Flex>
        {editable && (
          <Flex
            w={40}
            justify="flex-end"
            onPointerDown={(e) => controls.start(e)}
            style={{ cursor: "grab" }}
          >
            <IconGripVertical />
          </Flex>
        )}
      </Flex>
    </Reorder.Item>
  );
};

export default ListItem;
