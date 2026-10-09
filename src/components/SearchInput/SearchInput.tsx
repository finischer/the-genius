import { ActionIcon, TextInput, type TextInputProps } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";

interface ISearchInputProps extends Omit<TextInputProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<ISearchInputProps> = ({
  value,
  onChange,
  placeholder = "Suchen...",
  ...rest
}) => {
  return (
    <TextInput
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder={placeholder}
      leftSection={<IconSearch size={16} />}
      rightSection={
        value.length > 0 ? (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => onChange("")}
            aria-label="Suche leeren"
          >
            <IconX size={14} />
          </ActionIcon>
        ) : null
      }
      {...rest}
    />
  );
};

export default SearchInput;
