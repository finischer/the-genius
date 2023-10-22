import type {
  TSetCardColor,
  TSetCardFilling,
  TSetCardForm,
  TSetCard,
  TSetQuestionItem,
} from "~/components/room/Game/games/Set/set.types";
import { v4 as uuidv4 } from "uuid";

export function generateRandomFormCard(): TSetCard {
  const forms: TSetCardForm[] = ["rectangle", "oval", "diamond"];
  const colors: TSetCardColor[] = ["red", "green", "blue"];
  const fillings: TSetCardFilling[] = ["filled", "none", "dashed"];
  const MAX_NUMBER_OF_ELEMENTS = 3;

  const randomFormIndex = Math.floor(Math.random() * forms.length);
  const randomColorIndex = Math.floor(Math.random() * colors.length);
  const randomFillingIndex = Math.floor(Math.random() * fillings.length);
  const numberOfElements =
    Math.floor(Math.random() * MAX_NUMBER_OF_ELEMENTS) + 1;

  const form = forms[randomFormIndex] ?? "diamond";
  const color = colors[randomColorIndex] ?? "blue";
  const fill = fillings[randomFillingIndex] ?? "filled";
  const amount = numberOfElements ?? 1;
  const formId = `${form}-${color}-${fill}-${amount}`;

  const randomTForm: TSetCard = {
    id: formId,
    form,
    color,
    fill,
    amount,
  };

  return randomTForm;
}

export function generateNewSetQuestion(numOfCards: number): TSetQuestionItem {
  const cards: TSetCard[] = [];

  for (let i = 0; i < numOfCards; i++) {
    let randomForm = generateRandomFormCard();

    // check if form already exists in cards
    let card = cards.find((c) => c.id === randomForm.id);

    while (card) {
      randomForm = generateRandomFormCard();
      card = cards.find((c) => c.id === randomForm.id);
    }

    cards.push(randomForm);
  }

  return {
    id: uuidv4(),
    cards,
  };
}

export function findSets(cards: TSetCard[]): Array<Array<number>> {
  const sets: Array<Array<number>> = [];

  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        const card1 = cards[i];
        const card2 = cards[j];
        const card3 = cards[k];

        if (!card1 || !card2 || !card3) return [];
        if (isValidSet(card1, card2, card3)) {
          sets.push([i, j, k]);
        }
      }
    }
  }

  return sets;
}

function isValidSet(card1: TSetCard, card2: TSetCard, card3: TSetCard) {
  function allSame(a0: string, a1: string, a2: string) {
    return a0 === a1 && a1 === a2;
  }

  function allDifferent(a0: string, a1: string, a2: string) {
    return a0 !== a1 && a0 !== a2 && a1 !== a2;
  }

  const attributes: (keyof Omit<TSetCard, "id">)[] = [
    "form",
    "fill",
    "color",
    "amount",
  ];

  const results = [];

  for (const attribute of attributes) {
    const isAllSame = allSame(
      card1[attribute].toString(),
      card2[attribute].toString(),
      card3[attribute].toString()
    );

    const isAllDifferent = allDifferent(
      card1[attribute].toString(),
      card2[attribute].toString(),
      card3[attribute].toString()
    );

    if (isAllSame || isAllDifferent) {
      results.push(true);
    } else {
      results.push(false);
    }
  }

  return results.every((i) => i === true);
}
