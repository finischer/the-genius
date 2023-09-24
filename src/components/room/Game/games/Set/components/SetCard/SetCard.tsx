import {
  Container,
  Flex,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";
import ActionIcon from "~/components/shared/ActionIcon";
import type { TSetCard } from "../../set.types";
import SetForm from "../SetForm";
import type { ISetCardProps } from "./setCard.types";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

const cardVariants = {
  selected: {
    rotateY: 180,
    transition: { duration: 0.3 },
  },
  notSelected: (i: number) => ({
    rotateY: 0,
    transition: { duration: 0.3 },
  }),
};

const SetCard: React.FC<ISetCardProps> = ({
  editable = false,
  card,
  setCards,
  index,
  isFlipped = false,
  onClick = () => null,
}) => {
  const theme = useMantineTheme();

  const cardStyle: CSSProperties = {
    height: "10rem",
    width: "15rem",
    background: "white",
    position: "relative",
    display: "flex",
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
  };

  // const formElements =  card.forms.map(formItem => <SetForm onChange={onChangeForm} onRemove={removeFormFromCard} key={formItem.id} editable={editable} formItem={formItem} removeable={card.forms.length > 1} />)
  const formElements = Array(card.amount)
    .fill(null)
    .map((_, idx) => (
      <SetForm
        key={`${card.id}-${idx}`}
        onChange={onChangeCard}
        onRemove={removeFormFromCard}
        editable={editable}
        card={card}
        removeable={card.amount > 1}
      />
    ));

  function onChangeCard(newCard: TSetCard) {
    if (!setCards) return;

    setCards((draft) => {
      const cardIndex = draft.cards.findIndex((c) => c.id === card.id);
      draft.cards[cardIndex] = newCard;
    });
  }

  function addFormToCard() {
    if (!setCards) return;

    setCards((draft) => {
      const c = draft.cards.find((c) => c.id === card.id);
      if (!c) return;
      c.amount++;
    });
  }

  function removeFormFromCard(formId: string) {
    if (!setCards || formElements.length === 1) return;

    setCards((draft) => {
      const c = draft.cards.find((c) => c.id === card.id);
      if (!c || c.amount === 0) return;
      c.amount--;
    });
  }

  const FrontContent = () => (
    <div style={cardStyle}>
      <Text
        pos="absolute"
        weight="bold"
        size="2rem"
        color="dark"
      >
        {index + 1}
      </Text>
    </div>
  );

  const BackContent = () => (
    <div
      style={{
        ...cardStyle,
        transform: "scale(-1, 1)",
      }}
    >
      <Container
        pos="absolute"
        top={10}
        left={10}
        p={0}
      >
        <Text
          color="dimmed"
          weight="bold"
          size="xl"
        >
          {index + 1}
        </Text>
      </Container>
      {formElements}
      {editable && formElements.length < 3 && (
        <ActionIcon
          variant="default"
          ml="md"
          onClick={addFormToCard}
        >
          <IconPlus />
        </ActionIcon>
      )}
    </div>
  );

  return (
    <motion.div
      variants={cardVariants}
      animate={isFlipped ? "selected" : "notSelected"}
      onClick={() => onClick(card.id)}
    >
      {!isFlipped ? <FrontContent /> : <BackContent />}
    </motion.div>
  );
};

export default SetCard;
