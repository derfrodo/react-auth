import IAuthService from "./IAuthService";

export interface AuthServices {
    [identityProvider: string]: IAuthService | null | undefined;
}

export default AuthServices;
