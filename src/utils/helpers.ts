import { getYjsValue } from "@syncedstore/core";

export const createRandomUserName = () => {
  const randomID = Math.floor(Math.random() * 1000);

  return `Gast#${randomID}`;
};

export const goToNextQuestion = (
  questions: Array<unknown>,
  currIndex: number,
  cb: (newQuestionIndex: number) => void
) => {
  if (currIndex >= questions.length - 1) {
    return;
  }

  cb(currIndex + 1);
};

export const goToPreviousQuestion = (currIndex: number, cb: (newQuestionIndex: number) => void) => {
  if (currIndex <= 0) {
    return;
  }

  cb(currIndex - 1);
};

export function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export const assignObjectKeyByKey = (source: Record<string, unknown>, target: Record<string, unknown>) => {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "object" && value !== null) {
      target[key] = {};
      assignObjectKeyByKey(value as Record<string, unknown>, target[key] as Record<string, unknown>);
    } else {
      target[key] = value;
    }
  }
};

export const displayObject = (obj: Object) => {
  const value = getYjsValue(obj)?.toJSON();
  console.log(value);
  return value;
};
