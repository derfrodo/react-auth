import log from "loglevel";
import React from "react";
import { useHistory, useParams } from "react-router";
import {
    authActionCreators,
    useAuthReducerContextDispatch,
} from "../Auth/reducer";
import useStatefulAuthService from "../hooks/useStatefulAuthService";

export const AuthCallback: React.FC<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => any;
    children?: React.ReactNode;
}> = ({ onError, children }) => {
    const { provider } = useParams<{ provider: string | undefined }>();
    const h = useHistory();

    const service = useStatefulAuthService(provider);
    const dispatch = useAuthReducerContextDispatch();

    const [loggedIn, setLoggedIn] = React.useState(false);
    React.useEffect(() => {
        (async () => {
            if (loggedIn || !service) {
                return;
            }
            try {
                const { signinCallback } = service;
                const user = await signinCallback();
                console.log(user);
                const next = !loggedIn ? user !== undefined : loggedIn;
                setLoggedIn(() => next);
                log.debug(user);
                if (provider) {
                    dispatch(
                        authActionCreators.setUser(provider, user ?? undefined)
                    );
                }
                h.replace("/");
            } catch (err) {
                // not signed in
                log.error(err);
                onError(err);
            }
        })();
    }, [onError, dispatch, h, loggedIn, provider, service]);

    return <>{children}</>;
};

export default AuthCallback;
