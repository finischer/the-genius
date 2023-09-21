import { Flex, Menu, UnstyledButton, useMantineTheme } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import type React from "react"
import type { CSSProperties } from "react"
import { SET_FORMS, type TForm } from "../set.types"
import Diamond from "./Diamond"
import Oval from "./Oval"
import Rectangle from "./Rectangle"


// local interfaces
interface ISetFormProps {
    formItem: TForm
    editable?: boolean
    onChange?: (formId: string, newForm: TForm) => void
}


interface ICustomMenuItem {
    selected?: boolean,
    children: React.ReactNode
    name: string
}


// constants
export const DEFAULT_SET_FORM_STYLE: CSSProperties = {
    margin: "0 0.5rem",
    position: "relative",
    overflow: "hidden",
    alignSelf: "center",
    strokeWidth: "0.25rem",
    width: "2.6rem"
}

const CHECK_ICON_SIZE = 14

const SetForm: React.FC<ISetFormProps> = ({ editable = false, formItem, onChange }) => {
    const { form, color, fill, id } = formItem

    const theme = useMantineTheme()
    const isRectangle = form === "rectangle"
    const isOval = form === "oval"
    const isDiamond = form === "diamond"

    const FORM_MAP: { [key in typeof form]: JSX.Element } = {
        diamond: <Diamond color={color} fill={fill} />,
        rectangle: <Rectangle color={color} fill={fill} />,
        oval: <Oval color={color} fill={fill} />
    }

    const CustomMenuItem: React.FC<ICustomMenuItem> = ({ selected = false, children, name }) => (
        <Menu.Item onClick={() => handleChangeFormData(name)} bg={selected ? theme.primaryColor : undefined} rightSection={selected && <IconCheck size={CHECK_ICON_SIZE} />}>{children}</Menu.Item>
    )

    const handleChangeFormData = (menuItemName: string) => {
        if (!onChange) return

        const splitted = menuItemName.split("-")

        // must be a length of 2 (format: "key-value")
        if (splitted.length != 2) return

        const [key, value] = splitted as [keyof TForm, SET_FORMS]

        if (!key || !value) return

        // check if key is a key of TForm
        if (!Object.keys(formItem).includes(key)) return

        const newForm: TForm = {
            ...formItem,
            [key]: value
        }

        onChange(id, newForm)
    }


    if (editable) {
        return (
            <Flex h="100%" sx={{
                borderRadius: theme.radius.sm,
                cursor: "pointer",
                ":hover": {
                    background: theme.colors.dark[0]
                }
            }}>
                <Menu shadow="md" width={200} withArrow closeOnItemClick={false}>
                    <Menu.Target>
                        <UnstyledButton>
                            {FORM_MAP[form]}
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Form</Menu.Label>
                        <CustomMenuItem name="form-rectangle" selected={isRectangle}>Rechteck</CustomMenuItem>
                        <CustomMenuItem name="form-diamond" selected={isDiamond}>Raute</CustomMenuItem>
                        <CustomMenuItem name="form-oval" selected={isOval}>Oval</CustomMenuItem>

                        <Menu.Divider />

                        <Menu.Label>Farbe</Menu.Label>
                        <CustomMenuItem name="color-green" selected={color === "green"}>Grün</CustomMenuItem>
                        <CustomMenuItem name="color-blue" selected={color === "blue"}>Blau</CustomMenuItem>
                        <CustomMenuItem name="color-red" selected={color === "red"}>Rot</CustomMenuItem>
                        <Menu.Divider />

                        <Menu.Label>Füllung</Menu.Label>
                        <CustomMenuItem name="fill-filled" selected={fill === "filled"}>Gefüllt</CustomMenuItem>
                        <CustomMenuItem name="fill-dashed" selected={fill === "dashed"}>Gestrichelt</CustomMenuItem>
                        <CustomMenuItem name="fill-none" selected={fill === "none"}>Leer</CustomMenuItem>
                    </Menu.Dropdown>
                </Menu>

            </Flex>
        )
    }


    return FORM_MAP[form]
}

export default SetForm