import log from "loglevel";
import React from "react";
import {
    authActionCreators,
    IAuthService,
    useAuthReducerContextDispatch,
} from "..";
import { DEFAULT_AUTH_PROVIDER_NAME } from "../constants";
import { UserInfo } from "../interfaces/UserInfo";
import {
    AuthServiceOidcClient,
    AuthServiceOidcClientConfig,
} from "../Services/AuthServiceOidcClient";

/**
 * setups a stateful auth service for a given provider if the authentication settings are passed (no service will be set on settings === undefined || settings === null)
 * @param provider
 * @param authenticationSettings
 * @param reactToPossibleUserChange
 */
export const useCreateStatefulAuthService = (
    reactToPossibleUserChange?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((user?: UserInfo | undefined | null) => any) | null | undefined,
    provider: string = DEFAULT_AUTH_PROVIDER_NAME
): ((
    authenticationSettings: AuthServiceOidcClientConfig | null | undefined
) => IAuthService | null | undefined) => {
    const dispatch = useAuthReducerContextDispatch();
    return React.useCallback(
        (
            authenticationSettings:
                | AuthServiceOidcClientConfig
                | null
                | undefined
        ) => {
            if (
                authenticationSettings === undefined ||
                authenticationSettings === null
            ) {
                dispatch(authActionCreators.setAuthService(provider, null));
                dispatch(authActionCreators.setUser(provider, null));
                return null;
            } else {
                const service = new AuthServiceOidcClient(
                    authenticationSettings,
                    (u) => {
                        dispatch(authActionCreators.setUser(provider, u));

                        if (reactToPossibleUserChange) {
                            try {
                                reactToPossibleUserChange(u);
                            } catch (err) {
                                log.error(
                                    "Failed to perform passed callback to react on possible user changes",
                                    { error: err }
                                );
                            }
                        }
                    }
                );
                dispatch(authActionCreators.setAuthService(provider, service));
                return service;
            }
        },
        [dispatch, provider, reactToPossibleUserChange]
    );
};
