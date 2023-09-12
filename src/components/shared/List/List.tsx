import { Reorder } from 'framer-motion';
import React from 'react';
import ListItem from './components/ListItem';
import type { IListProps } from './list.types';

const List: React.FC<IListProps> = ({ editable = false, onClickItem = () => null, onDeleteItem = () => null, data, renderValueByKey, setData }) => {
    return (
        <Reorder.Group values={data} axis='y' onReorder={setData} style={{ gap: "1rem", display: "flex", flexDirection: "column", padding: 0, margin: 0 }}>
            {data.map(item => (
                <ListItem key={item.id} item={item} editable={editable} renderValueByKey={renderValueByKey} />
            ))}
        </Reorder.Group>
    )
}

export default List

