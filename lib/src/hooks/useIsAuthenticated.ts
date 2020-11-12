import { useMemo } from "react";
import { useAuthReducerContextState } from "../Auth";
import { DEFAULT_AUTH_PROVIDER_NAME } from "../constants";

export const useIsAuthenticated = (
    provider: string = DEFAULT_AUTH_PROVIDER_NAME
): boolean => {
    const state = useAuthReducerContextState();
    const { users } = state;
    return useMemo(() => !!(users && users[provider]) ?? false, [
        provider,
        users,
    ]);
};
