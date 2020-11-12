import AuthenticatedUsers from "../../interfaces/AuthenticatedUsers";
import AuthServices from "../../interfaces/AuthServices";

export interface State {
    isInitialized: boolean;
    isAuthenticating: boolean;

    services: AuthServices | undefined;
    users: AuthenticatedUsers | undefined;
}

export default State;
