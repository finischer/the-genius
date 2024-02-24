import { createContext } from "react";

interface IStepperControls {
  enableContinueButton: () => void;
  disableContinueButton: () => void;
}
export const StepperControlsContext = createContext<IStepperControls>({} as IStepperControls);
