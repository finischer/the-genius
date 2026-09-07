interface SeedFeedback {
  creatorEmail: string;
  comment: string;
  ratingGeneralExperience: number;
  ratingControlModerator: number;
  ratingDesign: number;
  browser: string;
  os: string;
}

export function createFeedbackSeed(
  overrides: SeedFeedback
): SeedFeedback {
  return overrides;
}

export const SEED_FEEDBACKS: SeedFeedback[] = [
  createFeedbackSeed({
    creatorEmail: "max@thegenius.local",
    comment: "Super App! Die Spielauswahl ist toll und der Buzzer funktioniert einwandfrei.",
    ratingGeneralExperience: 5,
    ratingControlModerator: 5,
    ratingDesign: 4,
    browser: "Chrome",
    os: "macOS"
  }),
  createFeedbackSeed({
    creatorEmail: "sophie@thegenius.local",
    comment: "Macht richtig Spaß mit Freunden. Der Moderatormodus ist sehr intuitiv.",
    ratingGeneralExperience: 5,
    ratingControlModerator: 4,
    ratingDesign: 5,
    browser: "Safari",
    os: "macOS"
  }),
  createFeedbackSeed({
    creatorEmail: "jonas@thegenius.local",
    comment: "Tolle Idee, aber manchmal hakt der Buzzer auf mobilen Geräten.",
    ratingGeneralExperience: 4,
    ratingControlModerator: 3,
    ratingDesign: 4,
    browser: "Chrome",
    os: "Android"
  }),
  createFeedbackSeed({
    creatorEmail: "laura@thegenius.local",
    comment: "Das Design ist sehr ansprechend. Würde mir mehr Spielvarianten wünschen.",
    ratingGeneralExperience: 4,
    ratingControlModerator: 4,
    ratingDesign: 5,
    browser: "Firefox",
    os: "Windows"
  }),
  createFeedbackSeed({
    creatorEmail: "tim@thegenius.local",
    comment: "Klasse! Haben die App auf unserer Weihnachtsfeier benutzt – alle waren begeistert.",
    ratingGeneralExperience: 5,
    ratingControlModerator: 5,
    ratingDesign: 5,
    browser: "Chrome",
    os: "Windows"
  })
];
