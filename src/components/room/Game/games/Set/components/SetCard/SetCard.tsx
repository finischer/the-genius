import { Container, Text, useMantineTheme, type MantineStyleProp, UnstyledButton } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";
import ActionIcon from "~/components/shared/ActionIcon";
import { useUser } from "~/hooks/useUser";
import type { TSetCard, TSetGameMarkedCardsState } from "../../set.types";
import SetForm from "../SetForm";
import type { ISetCardProps } from "./setCard.types";
import classes from "./setCard.module.css";

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

const BORDER_COLOR_MAP: { [key in TSetGameMarkedCardsState]: string } = {
  correct: "green",
  wrong: "red",
  marked: "orange",
};

const SetCard: React.FC<ISetCardProps> = ({
  editable = false,
  card,
  setCards,
  index,
  isFlipped = false,
  marked = false,
  markerState = "marked",
  onClick = () => null,
}) => {
  const { isHost } = useUser();
  const theme = useMantineTheme();
  const borderColor = BORDER_COLOR_MAP[markerState];

  const cardStyle: MantineStyleProp = {
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

  function removeFormFromCard() {
    if (!setCards || formElements.length === 1) return;

    setCards((draft) => {
      const c = draft.cards.find((c) => c.id === card.id);
      if (!c || c.amount === 0) return;
      c.amount--;
    });
  }

  const FrontContent = () => (
    <Container style={cardStyle}>
      <Text
        pos="absolute"
        fw="bold"
        size="2rem"
        c="dark"
      >
        {index + 1}
      </Text>
    </Container>
  );

  const BackContent = () => (
    <Container
      style={{
        ...cardStyle,
        transform: "scale(-1, 1)",
        cursor: isHost && markerState === "marked" ? "pointer" : "auto",
      }}
    >
      <Container
        pos="absolute"
        top={10}
        left={10}
        p={0}
      >
        <Text
          c="dimmed"
          fw="bold"
          fz=""
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
    </Container>
  );

  return (
    <motion.div
      className={classes.card}
      data-ishost={isHost}
      variants={cardVariants}
      animate={isFlipped ? "selected" : "notSelected"}
      onClick={() => onClick(index)}
      style={{
        borderRadius: theme.radius.xl,
        border: `6px solid ${marked ? borderColor : "transparent"}`,
      }}
    >
      {!isFlipped ? <FrontContent /> : <BackContent />}
    </motion.div>
  );
};

export default SetCard;
