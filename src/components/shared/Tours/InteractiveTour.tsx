import ReactJoyride, {
  type Props as JoyrideProps,
  type Step
} from "react-joyride";
import { interactiveTourDefaultProps } from "~/components/shared/Tours/config";
import { useMantineTheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import React, { useState } from "react";
import CustomTooltip from "~/components/shared/Tours/CustomTooltip";

interface InteractiveTourProps extends Omit<JoyrideProps, "run"> {
  tourId: string;
  run?: boolean;
  steps: Step[];
  withBeacon?: boolean;
}

const InteractiveTour: React.FC<InteractiveTourProps> = ({
  steps,
  tourId,
  run = null,
  withBeacon = false,
  ...props
}) => {
  const [runTourLocalStorage] = useLocalStorage({
    key: tourId,
    defaultValue: true,
    getInitialValueInEffect: false
  });

  const [runTourTmp] = useState(runTourLocalStorage);

  const runFinal = run === null ? runTourTmp : run;
  const theme = useMantineTheme();

  return (
    <ReactJoyride
      {...interactiveTourDefaultProps(theme)}
      {...props}
      beaconComponent={withBeacon ? undefined : () => null}
      steps={steps}
      run={runFinal}
      tooltipComponent={(props) => <CustomTooltip tourId={tourId} {...props} />}
    />
  );
};

export default InteractiveTour;
