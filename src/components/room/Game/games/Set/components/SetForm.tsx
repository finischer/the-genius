import { Flex, Menu, UnstyledButton, useMantineTheme } from "@mantine/core"
import type { CSSProperties } from "react"
import type { TForm, TSetCardColor, TSetCardFilling, TSetCardForm } from "../set.types"
import Diamond from "./Diamond"
import Oval from "./Oval"
import Rectangle from "./Rectangle"
import { IconCheck } from "@tabler/icons-react"
import type React from "react"

export const DEFAULT_SET_FORM_STYLE: CSSProperties = {
    margin: "0 0.5rem",
    position: "relative",
    overflow: "hidden",
    alignSelf: "center",
    strokeWidth: "0.25rem",
    width: "2.6rem"
}

interface ISetFormProps {
    formItem: TForm
    editable?: boolean
    onChange?: (formId: string, newForm: TForm) => void
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

    const CustomMenuItem = ({ selected = false, children }: { selected?: boolean, children: React.ReactNode }) => (
        <Menu.Item onClick={handleChangeFormData} bg={selected ? theme.primaryColor : undefined} rightSection={selected && <IconCheck size={CHECK_ICON_SIZE} />}>{children}</Menu.Item>
    )

    const handleChangeFormData = (e: any) => {
        console.log("Click Item! ", e)
        if (!onChange) return
        // onChange(id, )
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
                        <CustomMenuItem selected={isRectangle}>Rechteck</CustomMenuItem>
                        <CustomMenuItem selected={isDiamond}>Raute</CustomMenuItem>
                        <CustomMenuItem selected={isOval}>Oval</CustomMenuItem>

                        <Menu.Divider />

                        <Menu.Label>Farbe</Menu.Label>
                        <CustomMenuItem selected={color === "green"}>Grün</CustomMenuItem>
                        <CustomMenuItem selected={color === "blue"}>Blau</CustomMenuItem>
                        <CustomMenuItem selected={color === "red"}>Rot</CustomMenuItem>

                        <Menu.Divider />

                        <Menu.Label>Füllung</Menu.Label>
                        <CustomMenuItem selected={fill === "filled"}>Gefüllt</CustomMenuItem>
                        <CustomMenuItem selected={fill === "dashed"}>Gestrichelt</CustomMenuItem>
                        <CustomMenuItem selected={fill === "none"}>Leer</CustomMenuItem>
                    </Menu.Dropdown>
                </Menu>

            </Flex>
        )
    }


    return FORM_MAP[form]
}

export default SetForm