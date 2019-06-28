import { action } from "typesafe-actions";
import { TicketActionTypes, Ticket } from "./types";
import * as log from 'loglevel';
import { ticketCreate } from "../../api/support";
import { isEmptyString } from "../../utils/extras";
import { showAlert, hideAlert } from "../alert/actions"
import { getBasePath } from "../../config/environment";

const createRequest = (ticket: Ticket) => action(TicketActionTypes.TICKET_CREATE_REQUEST, ticket);
const createSuccess = () => action(TicketActionTypes.TICKET_CREATE_SUCCESS);
const createFailure = () => action(TicketActionTypes.TICKET_CREATE_FAILURE);

type Dispatcher = (param: any) => any;

export function createTicket(ticket: Ticket) {
    return function (dispatch: Dispatcher) {
        log.info('Creating ticket', ticket);
        hideAlert();
        dispatch(createRequest(ticket))

        // @ts-ignore
        return ticketCreate(ticket)
            .then((response: any) => {
                if (response.status === 201) {
                    log.info('Successfully created ticket')
                    dispatch(createSuccess())
                    dispatch(showAlert({
                        show: true,
                        title: 'Submitted!',
                        message: 'Thank you for reporting an issue with your delivery. We will verify your claim and issue a refund accordingly.',
                        btnText: 'Done',
                        onClick: () => { 
                            // @ts-ignore
                            window.location = getBasePath(); 
                        }
                    }))
                } else {
                    dispatch(createFailure())
                    response.json().then((json: any) => {
                        if (!isEmptyString(json.message)) {
                            const messageJson = JSON.parse(json.message);
                            log.error('Server rejected ticket creation request', messageJson)
                            dispatch(showAlert({
                                show: true,
                                title: response.statusText,
                                message: messageJson.description,
                                btnText: "Close",
                                onClick: () => { dispatch(hideAlert()) }
                            }))
                        } else {
                            onError(json, dispatch);
                        }
                    }).catch((err: any) => { onError(err, dispatch); })
                }
            })
            .catch((err: any) => { onError(err, dispatch); })
    }
}

function onError(err: any, dispatch: Dispatcher) {
    log.error('Unexpected error while creating ticket', err);
    showAlert({ 
        show: true,
        title: 'Unexpected Error', 
        message: 'Something went wrong. Please try again later.', 
        btnText: 'Close',
        onClick: () => { dispatch(hideAlert()) }
    });
    dispatch(createFailure())
}