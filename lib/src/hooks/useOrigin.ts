import { useMemo } from "react";

export const useOrigin = () => {
  return useMemo(
    () => (window.location ? window.location.origin : document.location.origin),
    []
  );
};
