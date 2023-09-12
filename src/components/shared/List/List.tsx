import React, { useState } from 'react';
import type { IListProps } from './list.types';
import { Reorder, useMotionValue } from 'framer-motion';
import { Flex } from '@mantine/core';
import { useRaisedShadow } from '~/hooks/useRaisedShadow';
import ListItem from './components/ListItem';

const List: React.FC<IListProps> = ({ canReorder = false, onClickItem = () => null, onDeleteItem = () => null, data, renderValueByKey, setData }) => {
    return (
        <Reorder.Group values={data} axis='y' onReorder={setData} style={{ gap: "1rem", display: "flex", flexDirection: "column", padding: 0, margin: 0 }}>
            {data.map(item => (
                <ListItem key={item.id} item={item} draggable={canReorder} renderValueByKey={renderValueByKey} />
            ))}
        </Reorder.Group>)
}

export default List

