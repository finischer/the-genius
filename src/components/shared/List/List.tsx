import { Center, Flex, Text } from "@mantine/core";
import { Reorder } from "framer-motion";
import ListItem from "./components/ListItem";
import type { IListItem } from "./components/ListItem/listItem.types";
import type { IListProps } from "./list.types";
import { useState } from "react";
import { useImmer } from "use-immer";

const List = <T,>({
  editable = false,
  deletableItems = false,
  onClickItem,
  onDeleteItem = () => null,
  data,
  renderValueByKey,
  setData,
  selectedItemId,
  emptyListText = "Füge deine erste Frage hinzu!",
  itemName = "Frage",
  showIndex = false,
  keyId,
  clickable = false,
}: IListProps<T>) => {
  const [selectedItems, setSelectedItems] = useImmer<string[]>([]);

  const handleDeleteItem = (itemId: string | number) => {
    if (!editable) return;

    setData((oldState: IListItem<T>[]) => {
      const newList = oldState.filter((item) => item[keyId] !== itemId);
      return newList;
    });

    onDeleteItem();
  };

  const handleSelectItem = (item: IListItem<T>) => {
    if (onClickItem && clickable) {
      const id = item[keyId] as string;

      if (selectedItems.includes(id)) {
        setSelectedItems((draft) => {
          draft = draft.filter((itemId) => itemId !== id);
        });
      } else {
        setSelectedItems((draft) => {
          draft.push(id);
        });
      }

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
        <Text
          size="xl"
          ta="center"
        >
          {emptyListText}
        </Text>
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
      {data.map((item, index) => {
        const key = item[keyId] as string;

        return (
          <ListItem
            key={key}
            item={item}
            deletable={deletableItems}
            editable={editable}
            selected={key === selectedItemId}
            onClick={() => handleSelectItem(item)}
            onDelete={() => handleDeleteItem(key)}
            // @ts-ignore
            content={!renderValueByKey ? `${itemName} ${index + 1}` : item[renderValueByKey]}
            showIndex={showIndex}
            index={index}
            clickable={onClickItem ? true : false}
            highlight={selectedItems.includes(key)}
          />
        );
      })}
    </Reorder.Group>
  );
};

export default List;
