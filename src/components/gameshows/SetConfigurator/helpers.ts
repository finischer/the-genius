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
