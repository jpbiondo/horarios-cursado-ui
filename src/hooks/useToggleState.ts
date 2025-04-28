import { useCallback, useState } from "react";

export const useToggleState = (initialFlagValue: boolean = false) => {
  const [flagValue, setFlagValue] = useState<boolean>(initialFlagValue);

  const toggle = useCallback(() => {
    setFlagValue((prev) => !prev);
  }, [setFlagValue]);
  return [flagValue, toggle] as const;
};
