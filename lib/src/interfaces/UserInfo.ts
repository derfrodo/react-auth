export type UserInfo = RemoteUserInfo | UserInfoBase;

export type UserInfoBase = {
    name: string;
};

export type IdTokenClaims = {
    name: string;
    user: string;
    sub: string;
    idp: string;
    emails: string[];
    aud: string;
    auth_time: number;
    exp: number;
    iat: number;
    nbf: number;
    family_name: string;
    given_name: string;
    iss: string;
    nonce: string;
    oid: string;
    tfp: string;
    ver: string;
};

export type RemoteUserInfo = {
    name: string;
    sid: string;
    idTokenClaims: IdTokenClaims;
};
