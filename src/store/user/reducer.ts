import { Reducer } from "redux";
import { UserInfoActionTypes, UserInfoState } from "./types";

export const initialUserInfoState: UserInfoState = {
    fetching: false,
    user: undefined,
    error: undefined
};


export const userInfoReducer: Reducer<UserInfoState> = (state = initialUserInfoState, action: any) => {
    switch (action.type) {
        case UserInfoActionTypes.FETCH_REQUEST: {
            return { ...state, fetching: true };
        }
        case UserInfoActionTypes.FETCH_SUCCESS: {
            return { ...state, fetching: false, user: action.payload };
        }
        case UserInfoActionTypes.FETCH_FAILURE: {
            return { ...state, fetching: false, error: action.payload };
        }
        default: {
            return state;
        }
    }
};
