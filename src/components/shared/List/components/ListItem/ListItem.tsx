import { Flex } from '@mantine/core'
import { Reorder, useMotionValue } from 'framer-motion'
import React from 'react'
import { useRaisedShadow } from '~/hooks/useRaisedShadow'
import type { IListItemProps } from './listItem.types'
import { IconGripVertical } from '@tabler/icons-react'

const ListItem: React.FC<IListItemProps> = ({ item, draggable, renderValueByKey }) => {
    const y = useMotionValue(0)
    const boxShadow = useRaisedShadow(y)

    return (
        <Reorder.Item id={item.id} value={item} dragListener={draggable} style={{ boxShadow, y, listStyle: "none", cursor: draggable ? "grab" : "auto" }}>
            <Flex sx={(theme) => ({ background: "#2C2E33", borderRadius: theme.radius.md })} px="md" py="sm" justify="space-between">
                <span>{item[renderValueByKey]}</span>
                {draggable && <IconGripVertical />}
            </Flex>
        </Reorder.Item>
    )
}

export default ListItem