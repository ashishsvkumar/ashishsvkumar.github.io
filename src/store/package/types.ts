export interface RedMartOrder {
    readonly tradeOrderId: string;
    readonly userId: string;
    readonly email: string;
    readonly status: string;
    readonly isAsap: boolean;
    readonly createdAt: string;
    readonly deliverySlot: string;
    readonly items: RedMartItem[],
    readonly refundableItems: RedMartItem[]
}

export interface RedMartItem {
    readonly name: string;
    readonly quantity: number;
    readonly unitPrice: string;
    readonly itemId: string;
    readonly skuId: string;
    readonly productPage: string;
    readonly thumbnail: string;
    readonly isFreeGift: boolean;
    readonly isFreeSample: boolean;
    readonly status?: string,
    readonly reversible?: Reversible
}

export interface Reversible {
    readonly desc: string
}

export const enum RedMartOrderActionTypes {
    FETCH = "rm/package/fetch",
    SUCCESS = "rm/package/success",
    FAILURE = "rm/package/failure",
    DETAILS_FETCH = "rm/package/details/fetch",
    DETAILS_SUCCESS = "rm/package/details/success",
    DETAILS_FAILURE = "rm/package/details/failure",
}

export interface RedMartOrderState {
    readonly fetching: boolean;
    readonly error?: string;
    readonly order?: RedMartOrder;
}

export interface RedMartOrderState {
    readonly fetching: boolean;
    readonly error?: string;
    readonly fetched: boolean,
    readonly orders: RedMartOrder[];
    readonly noOrders: boolean,
    readonly details: {
        [tradeOrderId: string]: RedMartOrderState
    }
}
