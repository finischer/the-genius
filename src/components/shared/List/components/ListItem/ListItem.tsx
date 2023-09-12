import { Flex } from '@mantine/core'
import { IconGripVertical, IconX } from '@tabler/icons-react'
import { Reorder, useMotionValue } from 'framer-motion'
import React from 'react'
import ActionIcon from '~/components/shared/ActionIcon'
import { useRaisedShadow } from '~/hooks/useRaisedShadow'
import type { IListItemProps } from './listItem.types'

const ListItem: React.FC<IListItemProps> = ({ item, editable, renderValueByKey }) => {
    const y = useMotionValue(0)
    const boxShadow = useRaisedShadow(y)

    return (
        <Reorder.Item id={item.id} value={item} dragListener={editable} style={{ boxShadow, y, listStyle: "none", cursor: editable ? "grab" : "auto" }}>
            <Flex sx={(theme) => ({ background: "#2C2E33", borderRadius: theme.radius.md })} px="md" py="sm" justify="space-between">
                <Flex gap="md" align="center">
                    <ActionIcon size="sm" toolTip='Antwort löschen'>
                        <IconX />
                    </ActionIcon>
                    <span>{item[renderValueByKey]}</span>
                </Flex>
                {editable && <IconGripVertical />}
            </Flex>
        </Reorder.Item>
    )
}

export default ListItem