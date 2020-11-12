import log from "loglevel";
import { SignoutResponse, User } from "oidc-client";
import React from "react";
import { useHistory } from "react-router";

export interface AuthState {
    path: string;
}

export const useAuthState = () => {
    const h = useHistory();
    const isAuthState = React.useCallback((state: any): state is AuthState => {
        if (typeof state === "object") {
            try {
                const { path } = state as AuthState;
                return typeof path === "string";
            } catch (err) {
                log.error(err);
                return false;
            }
        }
        return false;
    }, []);

    const parseAuthState = React.useCallback(
        (state: any) => {
            if (typeof state === "string") {
                try {
                    const parsed = JSON.parse(state);
                    return isAuthState(parsed) ? parsed : undefined;
                } catch (err) {
                    log.error(err);
                    return undefined;
                }
            }
            return isAuthState(state) ? state : undefined;
        },
        [isAuthState]
    );

    const getUserState = React.useCallback(
        (user: User | undefined | SignoutResponse) => {
            const { state } = user || {};
            return parseAuthState(state);
        },
        [parseAuthState]
    );

    const getStateString = React.useCallback((state: AuthState) => {
        return JSON.stringify(state);
    }, []);

    const redirectToStatePath = React.useCallback(
        (user: User | undefined | SignoutResponse, toIfNoState?: string) => {
            const state = getUserState(user);
            if (state) {
                h.push(state.path);
            } else if (typeof toIfNoState === "string") {
                h.push(toIfNoState);
            }
        },
        [getUserState, h]
    );

    return React.useMemo(
        () => ({
            isAuthState,
            parseAuthState,
            getUserState,
            createStateString: getStateString,
            redirectToStatePath,
        }),
        [
            getStateString,
            getUserState,
            isAuthState,
            parseAuthState,
            redirectToStatePath,
        ]
    );
};

export default useAuthState;
