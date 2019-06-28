export interface UserInfo {
    avatar?: string,      // profile pic
    contactEmail: string,
    email: string,
    hasAddress: string,   //  ("true", "false"),
    id: string,
    isLiveUp: string,
    memberLevel: string   // "TRUSTED",
    name: string,
    phone: string
}

export const enum UserInfoActionTypes {
    FETCH_REQUEST = "userinfo/fetch/request",
    FETCH_SUCCESS = "userinfo/fetch/success",
    FETCH_FAILURE = "userinfo/fetch/failure",
}

export interface UserInfoState {
    readonly fetching: boolean,
    readonly user?: UserInfo,
    readonly error?: string
}

