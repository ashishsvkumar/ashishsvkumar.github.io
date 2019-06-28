import { Reducer } from "redux";
import { ChatActionTypes, ChatState } from "./types";

export const initialChatState: ChatState = {
    loading: false,
    loaded: false,
    snapEngageInstance: undefined,
    isOffline: true
};

export const chatReducer: Reducer<ChatState> = (state = initialChatState, action: any) => {
    switch (action.type) {
        case ChatActionTypes.INIT: {
            return { ...state, loading: true }
        }
        case ChatActionTypes.READY: {
            return { ...state, loading: false, loaded: true, snapEngageInstance: action.payload }
        }
        case ChatActionTypes.ONLINE: {
            return { ...state, isOffline: false }
        }
        case ChatActionTypes.OFFLINE: {
            return { ...state, isOffline: true }
        }
        default: {
            return state;
        }
    }
}
