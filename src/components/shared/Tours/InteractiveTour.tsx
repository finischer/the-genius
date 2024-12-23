import ReactJoyride, {
  type Props as JoyrideProps,
  type Step
} from "react-joyride";
import { interactiveTourDefaultProps } from "~/components/shared/Tours/config";
import { useMantineTheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import React from "react";
import CustomTooltip from "~/components/shared/Tours/CustomTooltip";

interface InteractiveTourProps extends Omit<JoyrideProps, "run"> {
  tourId: string;
  run?: boolean;
  steps: Step[];
}

const InteractiveTour: React.FC<InteractiveTourProps> = ({
  steps,
  tourId,
  run = null,
  ...props
}) => {
  const [runTour] = useLocalStorage({
    key: tourId,
    defaultValue: true,
    getInitialValueInEffect: false
  });

  const runFinal = run !== null ? run : runTour;
  const theme = useMantineTheme();

  return (
    <ReactJoyride
      {...interactiveTourDefaultProps(theme)}
      {...props}
      beaconComponent={() => null}
      steps={steps}
      run={runFinal}
      tooltipComponent={(props) => <CustomTooltip tourId={tourId} {...props} />}
    />
  );
};

export default InteractiveTour;
