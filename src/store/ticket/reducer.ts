import { Reducer } from "redux";
import { TicketActionTypes, TicketState, Result } from "./types";


export const initialTicketState: TicketState = {
    inProgress: false,
    request: undefined,
    result: undefined
};


export const ticketReducer: Reducer<TicketState> = (state = initialTicketState, action: any) => {
    switch (action.type) {
        case TicketActionTypes.TICKET_CREATE_REQUEST: {
            return { ...state, inProgress: true, request: action.payload, result: undefined };
        }
        case TicketActionTypes.TICKET_CREATE_SUCCESS: {
            return { ...state, inProgress: false, result: Result.SUCCESS };
        }
        case TicketActionTypes.TICKET_CREATE_FAILURE: {
            return { ...state, inProgress: false, result: Result.FAILURE };
        }
        default: {
            return state;
        }
    }
};
