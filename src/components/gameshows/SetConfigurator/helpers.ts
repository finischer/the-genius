import type {
  TForm,
  TSetCardColor,
  TSetCardFilling,
  TSetCardForm,
  TSetCard,
  TSetQuestionItem,
} from "~/components/room/Game/games/Set/set.types";
import { v4 as uuidv4 } from "uuid";

export function generateRandomForm(): TForm {
  const forms: TSetCardForm[] = ["rectangle", "oval", "diamond"];
  const colors: TSetCardColor[] = ["red", "green", "blue"];
  const fillings: TSetCardFilling[] = ["filled", "none", "dashed"];

  const randomFormIndex = Math.floor(Math.random() * forms.length);
  const randomColorIndex = Math.floor(Math.random() * colors.length);
  const randomFillingIndex = Math.floor(Math.random() * fillings.length);

  const randomTForm: TForm = {
    id: uuidv4(),
    form: forms[randomFormIndex] ?? "diamond",
    color: colors[randomColorIndex] ?? "blue",
    fill: fillings[randomFillingIndex] ?? "filled",
  };

  return randomTForm;
}

export function generateRandomFormList(): TSetCard {
  const randomTFormList: TForm[] = [];

  // Erzeuge maximal 3 zufällige TForm-Objekte
  for (let i = 0; i < Math.min(3, 27); i++) {
    // 3 * 3 * 3 = 27 mögliche Kombinationen
    const randomTForm = generateRandomForm();
    randomTFormList.push(randomTForm);
  }

  return {
    id: uuidv4(),
    forms: randomTFormList,
  };
}

export function generateNewSetQuestion(numOfCards: number): TSetQuestionItem {
  return {
    id: uuidv4(),
    cards: Array(numOfCards)
      .fill(null)
      .map((_) => generateRandomFormList()),
  };
}

export function findSets(cards: TSetCard[]) {
  const sets = [];

  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        const card1 = cards[i];
        const card2 = cards[j];
        const card3 = cards[k];

        if (!card1 || !card2 || !card3) return;

        if (isValidSet(card1, card2, card3)) {
          sets.push([i, j, k]);
        }
      }
    }
  }

  return sets;
}

function isValidSet(card1: TSetCard, card2: TSetCard, card3: TSetCard) {
  const attributes: (keyof Omit<TForm, "id">)[] = ["form", "fill", "color"];

  for (const attribute of attributes) {
    const values1 = card1.forms.find((f) => f[attribute]);
    const values2 = card2.forms.find((f) => f[attribute]);
    const values3 = card3.forms.find((f) => f[attribute]);

    if (!values1 || !values2 || !values3) return;

    if (!isValidAttributeCombination(values1, values2, values3)) {
      return false;
    }
  }

  return true;
}

function isValidAttributeCombination(
  values1: TForm,
  values2: TForm,
  values3: TForm
) {
  console.log("+++++++++++++++++++++");
  console.log("Values1: ", values1);
  console.log("Values2: ", values2);
  console.log("Values3: ", values3);
  console.log("+++++++++++++++++++++");
  return false;
  // const uniqueValues = new Set([...values1, ...values2, ...values3]);
  // console.log("Unique values: ", uniqueValues);
  // return uniqueValues.size === 1 || uniqueValues.size === 3;
}
