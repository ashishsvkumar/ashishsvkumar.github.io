export interface Ticket {
    type: TicketType,
    subject?: string,
    forLazada: boolean,
    email?: string,
    memberId?: string,
    primaryReasonCodeId?: string,
    secondaryReasonCodeId?: string,
    publicId?: string,
    comment?: string,
    rpc?: {id: string, quantity: number, reasonCodeId: string}[],
    attachments?: {name: string, link: string}[],
    refundMethod?: string,
    tags?: string[]
}

export const enum RefundMethod {
    CC_PAYPAL = "CC_PAYPAL"
}

export const enum TicketType {
    ORDER = "ORDER",
    NON_ORDER = "NON_ORDER",
    ACCOUNT = "ACCOUNT",
    PRODUCT = "PRODUCT",
    DELIVERY = "DELIVERY",
    PAYMENT = "PAYMENT",
    CHECKOUT = "CHECKOUT",
    MISCELLANEOUS = "MISCELLANEOUS" 
}

export const enum TicketActionTypes {
    TICKET_CREATE_REQUEST = "ticket/create/request",
    TICKET_CREATE_SUCCESS = "ticket/create/success",
    TICKET_CREATE_FAILURE = "ticket/create/failure"
}

export const enum Result {
    SUCCESS = "success",
    FAILURE = "failure"
}

export interface TicketState {
    inProgress: boolean,
    request?: Ticket,
    result?: Result
}
