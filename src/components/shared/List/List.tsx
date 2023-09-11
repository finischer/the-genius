import React, { useState } from 'react';
import type { IListProps } from './list.types';
import { Reorder } from 'framer-motion';

const List: React.FC<IListProps> = ({ canReorder = false, onClickItem = () => null, onDeleteItem = () => null, data, renderValueByKey, setData }) => {
    // TODO: Add design to List items
    return (
        <Reorder.Group values={data} axis='y' onReorder={setData}>
            {data.map(item => (
                <Reorder.Item key={item.id} value={item} dragListener={canReorder}>
                    {item[renderValueByKey]}
                </Reorder.Item>
            ))}
        </Reorder.Group>)
}

export default List

