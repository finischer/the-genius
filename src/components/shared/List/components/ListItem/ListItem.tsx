import { Flex, useMantineTheme } from '@mantine/core'
import { IconGripVertical, IconX } from '@tabler/icons-react'
import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import React from 'react'
import ActionIcon from '~/components/shared/ActionIcon'
import { useRaisedShadow } from '~/hooks/useRaisedShadow'
import type { IListItemProps } from './listItem.types'

const ListItem: React.FC<IListItemProps> = ({ item, editable, renderValueByKey, onDelete, onClick, selected }) => {
    const y = useMotionValue(0)
    const boxShadow = useRaisedShadow(y)
    const controls = useDragControls()
    const theme = useMantineTheme()

    const handleClick = (itemId: string) => {
        if (onClick) {
            onClick(itemId)
        }
    }

    const handleDelete = (e: React.SyntheticEvent) => {
        if (onDelete) {
            onDelete()
            e.stopPropagation()
        }
    }

    return (
        <Reorder.Item id={item.id} value={item} dragListener={false} style={{ boxShadow, y, listStyle: "none", cursor: editable ? "pointer" : "auto" }} dragControls={controls} onClick={() => handleClick(item.id)}>
            <Flex bg={selected ? theme.primaryColor : theme.colors.dark[5]} sx={{ borderRadius: theme.radius.md }} px="md" py="sm" justify="space-between">
                <Flex gap="md" align="flex-start">
                    <ActionIcon size="sm" toolTip='Antwort löschen' onClick={handleDelete}>
                        <IconX />
                    </ActionIcon>
                    <span>{item[renderValueByKey]}</span>
                </Flex>
                {editable &&
                    <Flex w={40} justify="flex-end" onPointerDown={e => controls.start(e)} style={{ cursor: "grab" }}>
                        <IconGripVertical />
                    </Flex>
                }
            </Flex>
        </Reorder.Item>
    )
}

export default ListItem