import { action } from "typesafe-actions";
import { AlertState, AlertActionTypes } from "./types";

export const showAlert = (alert: AlertState) => action(AlertActionTypes.SHOW_ALERT, alert);
export const hideAlert = () => action(AlertActionTypes.HIDE_ALERT);

type Dispatcher = (param: any) => any;

export function showMessage(title: string, message: any, btnText: string) {
    return function (dispatch: Dispatcher) {
        dispatch(showAlert({
           show: true,
           title, 
           message, 
           btnText,
           onClick: () => dispatch(hideAlert())
        }))
    }
}
