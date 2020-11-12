import log from "loglevel";
import React from "react";
import { useAuthReducerContextDispatch, authActionCreators } from "..";
import { UserInfo } from "../interfaces/UserInfo";
import {
    AuthServiceOidcClient,
    AuthServiceOidcClientConfig,
} from "../Services/AuthServiceOidcClient";
import useStatefulAuthService from "./useStatefulAuthService";

/**
 * setups a stateful auth service for a given provider if the authentication settings are passed (no service will be set on settings === undefined || settings === null)
 * @param provider
 * @param authenticationSettings
 * @param reactToPossibleUserChange
 */
export const useCreateStatefulAuthService = (
    provider: string,
    authenticationSettings: AuthServiceOidcClientConfig | null | undefined,
    reactToPossibleUserChange:
        | ((user?: UserInfo | undefined | null) => any)
        | null
        | undefined
) => {
    const dispatch = useAuthReducerContextDispatch();
    React.useEffect(() => {
        if (
            authenticationSettings === undefined ||
            authenticationSettings === null
        ) {
            dispatch(authActionCreators.setAuthService(provider, null));
            dispatch(authActionCreators.setUser(provider, null));
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
        }
    }, []);
    return useStatefulAuthService(provider);
};
