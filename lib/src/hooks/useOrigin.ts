import { useMemo } from "react";

export const useOrigin = (): string => {
    return useMemo(
        () =>
            window.location ? window.location.origin : document.location.origin,
        []
    );
};
