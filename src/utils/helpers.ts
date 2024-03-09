export const crateRandomUserName = () => {
  const randomID = Math.floor(Math.random() * 1000);

  return `User #${randomID}`;
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
