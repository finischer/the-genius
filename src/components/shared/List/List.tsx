import { Flex, Group, Text } from "@mantine/core";
import { Reorder } from "framer-motion";
import React from "react";
import ListItem from "./components/ListItem";
import type { IListItem } from "./components/ListItem/listItem.types";
import type { IListProps } from "./list.types";

const List = <T,>({
  editable = false,
  deletableItems = false,
  onClickItem = () => null,
  onDeleteItem = () => null,
  data,
  renderValueByKey,
  setData,
  selectedItemId,
  emptyListText = "Füge deine erste Frage hinzu!",
  itemName = "Frage",
  showIndex = false,
}: IListProps<T>) => {
  const handleDeleteItem = (itemId: string | number) => {
    if (!editable) return;

    setData((oldState: IListItem<T>[]) => {
      const newList = oldState.filter((item) => item.id !== itemId);
      return newList;
    });

    onDeleteItem();
  };

  const handleSelectItem = (item: IListItem<T>) => {
    if (onClickItem && editable) {
      onClickItem(item);
    }
  };

  if (data.length === 0) {
    return (
      <Flex
        h="100%"
        justify="center"
        align="center"
      >
        <Text size="xl">{emptyListText}</Text>
      </Flex>
    );
  }

  return (
    <Reorder.Group
      values={data}
      axis="y"
      as="ol"
      onReorder={setData}
      style={{
        gap: "1rem",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        margin: 0,
        userSelect: "none",
      }}
    >
      {data.map((item, index) => (
        <ListItem
          key={item.id}
          item={item}
          deletable={deletableItems}
          editable={editable}
          selected={item.id === selectedItemId}
          onClick={() => handleSelectItem(item)}
          onDelete={() => handleDeleteItem(item.id)}
          // @ts-ignore
          content={!renderValueByKey ? `${itemName} ${index + 1}` : item[renderValueByKey]}
          showIndex={showIndex}
          index={index}
        />
      ))}
    </Reorder.Group>
  );
};

export default List;
