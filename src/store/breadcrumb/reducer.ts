import { Reducer } from "redux";
import { BreadcrumbActionTypes, breadcrumbState } from "./types";

export const initialBreadcrumbState: breadcrumbState = {
    breadcrumbs: []
};

export const breadcrumbReducer: Reducer<breadcrumbState> = (state = initialBreadcrumbState, action: any) => {
    switch (action.type) {
        case BreadcrumbActionTypes.SET: {
            return { breadcrumbs: action.payload }
        }
        case BreadcrumbActionTypes.CLEAR: {
            return { breadcrumbs: [] }
        }
        default: {
            return state;
        }
    }
}
