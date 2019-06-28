import { Reducer } from "redux";
import { AlertActionTypes, AlertState } from "./types";

export const initialAlertState: AlertState = {
    show: false,
    title: null,
    message: null,
    btnText: null,
    onClick: null
};

export const alertReducer: Reducer<AlertState> = (state = initialAlertState, action: any) => {
    switch (action.type) {
        case AlertActionTypes.SHOW_ALERT: {
            return { ...state, ...action.payload, show: true }
        }
        case AlertActionTypes.HIDE_ALERT: {
            return { ...state, show: false }
        }
        default: {
            return state;
        }
    }
}
