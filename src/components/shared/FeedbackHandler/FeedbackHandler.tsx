import React, { useState } from "react";
import FeedbackButton from "../FeedbackButton";
import FeedbackForm from "../FeedbackForm";

const FeedbackHandler = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const openFeedbackForm = () => {
    setShowFeedbackForm(true);
  };

  const closeFeedbackForm = () => {
    setShowFeedbackForm(false);
  };

  return (
    <>
      <FeedbackForm
        opened={showFeedbackForm}
        closeForm={closeFeedbackForm}
      />
      <FeedbackButton onClick={openFeedbackForm} />
    </>
  );
};

export default FeedbackHandler;
