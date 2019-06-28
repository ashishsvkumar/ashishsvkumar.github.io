export interface Alert {
    show: boolean,
    title: string,
    message: any,
    btnText: string,
    onClick: () => void
}

export const enum AlertActionTypes {
    SHOW_ALERT = "alert/show",
    HIDE_ALERT = "alert/hide"
}

export type AlertState = Alert;
