export interface IModPanelProps {
  disclosure: readonly [
    boolean,
    {
      readonly open: () => void;
      readonly close: () => void;
      readonly toggle: () => void;
    }
  ];
}
