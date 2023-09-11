import React, { useState } from 'react';
import type { IListProps } from './list.types';
import { Reorder, useMotionValue } from 'framer-motion';
import { Flex } from '@mantine/core';
import { useRaisedShadow } from '~/hooks/useRaisedShadow';

const List: React.FC<IListProps> = ({ canReorder = false, onClickItem = () => null, onDeleteItem = () => null, data, renderValueByKey, setData }) => {
    const y = useMotionValue(0)
    const boxShadow = useRaisedShadow(y)
    // TODO: Add design to List items
    return (
        <Reorder.Group values={data} axis='y' onReorder={setData} style={{ gap: "1rem", display: "flex", flexDirection: "column", padding: 0, margin: 0 }}>
            {data.map(item => (
                <Reorder.Item key={item.id} value={item} dragListener={canReorder} style={{ boxShadow, listStyle: "none" }}>
                    <Flex sx={(theme) => ({ background: "#2C2E33", borderRadius: theme.radius.md })} px="md" py="sm">
                        <span>{item[renderValueByKey]}</span>
                    </Flex>
                </Reorder.Item>
            ))}
        </Reorder.Group>)
}

export default List

