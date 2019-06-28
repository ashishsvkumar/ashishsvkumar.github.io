import { Reducer } from "redux";
import { RedMartOrderActionTypes, RedMartOrderState } from "./types";

export const initialRedMartOrderState: RedMartOrderState = {
  fetching: false,
  orders: [],
  error: undefined,
  noOrders: false,
  fetched: false,
  details: {}
};

export const redmartOrderReducer: Reducer<RedMartOrderState> = (state = initialRedMartOrderState, action: any) => {
  switch (action.type) {
    case RedMartOrderActionTypes.FETCH: {
      return { ...state, fetching: true, fetched: false };
    }
    case RedMartOrderActionTypes.SUCCESS: {
      const haveNoOrders = (typeof action.payload === 'object') && (action.payload instanceof Array) && action.payload.length === 0;
      return { ...state, orders: action.payload, fetching: false, noOrders: haveNoOrders, fetched: true };
    }
    case RedMartOrderActionTypes.FAILURE: {
      return { ...state, error: action.payload, fetching: false, fetched: true };
    }
    case RedMartOrderActionTypes.DETAILS_FETCH: {
      return { ...state, details: { ...state.details, [action.payload]: { fetching: true } } };
    }
    case RedMartOrderActionTypes.DETAILS_SUCCESS: {
      return { ...state, details: { ...state.details, [action.payload.tradeOrderId]: { fetching: false, order: action.payload.data } } };
    }
    case RedMartOrderActionTypes.DETAILS_FAILURE: {
      return { ...state, details: { ...state.details, [action.payload.tradeOrderId]: { fetching: false, error: action.payload.error } } };
    }
    default: {
      return state;
    }
  }
};
