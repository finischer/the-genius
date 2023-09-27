import { Reorder } from "framer-motion";
import React from "react";
import ListItem from "./components/ListItem";
import type { IListItem } from "./components/ListItem/listItem.types";
import type { IListProps } from "./list.types";
import { Flex, ScrollArea, Text } from "@mantine/core";

const List: React.FC<IListProps> = ({
  editable = false,
  onClickItem = () => null,
  onDeleteItem = () => null,
  data,
  renderValueByKey,
  setData,
  selectedItemId,
}) => {
  const handleDeleteItem = (itemId: string | number) => {
    if (!editable) return;

    setData((oldState: IListItem[]) => {
      const newList = oldState.filter((item) => item.id !== itemId);
      return newList;
    });

    onDeleteItem();
  };

  const handleSelectItem = (item: IListItem) => {
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
        <Text size="xl">Füge deine erste Frage hinzu!</Text>
      </Flex>
    );
  }

  return (
    <Reorder.Group
      values={data}
      axis="y"
      onReorder={setData}
      style={{
        gap: "1rem",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        margin: 0,
      }}
    >
      {data.map((item, index) => (
        <ListItem
          key={item.id}
          item={item}
          editable={editable}
          selected={item.id === selectedItemId}
          onClick={() => handleSelectItem(item)}
          onDelete={() => handleDeleteItem(item.id)}
          // @ts-ignore
          content={!renderValueByKey ? `Frage ${index + 1}` : item[renderValueByKey]}
        />
      ))}
    </Reorder.Group>
  );
};

export default List;
