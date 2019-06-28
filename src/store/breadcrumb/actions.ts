import { action } from "typesafe-actions";
import { BreadcrumbActionTypes, BreadcrumbEntry } from "./types";

export const setBreadcrumbs = (crumbs: BreadcrumbEntry[]) => action(BreadcrumbActionTypes.SET, crumbs);
export const clearBreadcrumbs = () => action(BreadcrumbActionTypes.CLEAR);
