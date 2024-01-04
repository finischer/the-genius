import { Flex, useMantineTheme } from "@mantine/core";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import React from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import { useRaisedShadow } from "~/hooks/useRaisedShadow";
import type { IListItemProps } from "./listItem.types";
import { Group } from "@mantine/core";

const ListItem = <T,>({
  item,
  editable,
  deletable,
  onDelete,
  onClick,
  selected,
  content,
  showIndex,
  index,
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
        w="100%"
        justify="space-between"
      >
        <Flex
          gap="md"
          align="flex-start"
        >
          {editable && (
            <Flex
              w={30}
              justify="flex-end"
              onPointerDown={(e) => controls.start(e)}
              style={{ cursor: "grab" }}
            >
              <IconGripVertical />
            </Flex>
          )}

          <span>{content}</span>
        </Flex>
        {deletable && (
          <ActionIcon
            size="sm"
            variant="subtle"
            radius="xs"
            toolTip="Aus Liste entfernen"
            onClick={handleDelete}
          >
            <IconX />
          </ActionIcon>
        )}
      </Flex>
    </Reorder.Item>
  );
};

export default ListItem;
