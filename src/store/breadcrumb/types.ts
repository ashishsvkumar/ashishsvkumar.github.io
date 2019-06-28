export interface BreadcrumbEntry {
    text: string,
    url: string,
    needLogin: boolean
}

export const enum BreadcrumbActionTypes {
    SET = "breadcrumb/set",
    CLEAR = "breadcrumb/clear"
}

export interface breadcrumbState {
    breadcrumbs: BreadcrumbEntry[]
}
