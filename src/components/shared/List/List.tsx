import React from 'react';
import type { IListProps } from './list.types';

const List: React.FC<IListProps> = ({ draggable = false, onClickItem = () => null, onDeleteItem = () => null, data }) => {
    return <div>{data.map(item => <p>{item}</p>)}</div>
}

export default List

