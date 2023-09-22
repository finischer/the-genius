import { Reorder } from 'framer-motion';
import React, { useState } from 'react';
import ListItem from './components/ListItem';
import type { IListProps } from './list.types';
import type { IListItem } from './components/ListItem/listItem.types';

const List: React.FC<IListProps> = ({ editable = false, onClickItem = () => null, onDeleteItem = () => null, data, renderValueByKey, setData, selectedItemId }) => {
    const handleDeleteItem = (itemId: string | number) => {
        if (!editable) return

        setData((oldState: IListItem[]) => {
            const newList = oldState.filter(item => item.id !== itemId)
            return newList
        })
    }

    const handleSelectItem = (item: IListItem) => {
        if (onClickItem && editable) {
            onClickItem(item)
        }
    }

    return (
        <Reorder.Group values={data} axis='y' onReorder={setData} style={{ gap: "1rem", display: "flex", flexDirection: "column", padding: 0, margin: 0 }} >
            {
                data.map((item, index) => (
                    <ListItem
                        key={item.id}
                        item={item}
                        editable={editable}
                        selected={item.id === selectedItemId}
                        onClick={() => handleSelectItem(item)}
                        onDelete={() => handleDeleteItem(item.id)}
                        content={!renderValueByKey ? `Frage ${index + 1}` : item[renderValueByKey]}
                    />
                ))
            }
        </Reorder.Group >
    )
}

export default List

