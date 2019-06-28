import { combineReducers } from "redux";
import { initialArticlesState, initialSectionsState, initialCategoriesState, articleReducer, sectionReducer, cateogryReducer } from "./faq/reducer";
import { ArticlesState, SectionsState, CategoriesState } from "./faq/types";
import { AlertState } from "./alert/types";
import { initialAlertState, alertReducer } from "./alert/reducer";
import { TicketState } from "./ticket/types";
import { initialTicketState, ticketReducer } from "./ticket/reducer";
import { breadcrumbState } from "./breadcrumb/types";
import { initialBreadcrumbState, breadcrumbReducer } from "./breadcrumb/reducer";
import { UserInfoState } from "./user/types";
import { initialUserInfoState, userInfoReducer } from "./user/reducer";
import { ChatState } from "./chat/types";
import { initialChatState, chatReducer } from "./chat/reducer"
import { RedMartOrderState } from "./package/types";
import { initialRedMartOrderState, redmartOrderReducer } from "./package/reducer";


export interface ApplicationState {
  articles: ArticlesState,
  sections: SectionsState,
  categories: CategoriesState,
  alert: AlertState,
  ticket: TicketState,
  breadcrumbs: breadcrumbState,
  user: UserInfoState,
  chat: ChatState,
  redmartOrders: RedMartOrderState
}

export const initialState: ApplicationState = {
  articles: initialArticlesState,
  sections: initialSectionsState,
  categories: initialCategoriesState,
  alert: initialAlertState,
  ticket: initialTicketState,
  breadcrumbs: initialBreadcrumbState,
  user: initialUserInfoState,
  chat: initialChatState,
  redmartOrders: initialRedMartOrderState
};

export const rootReducer = combineReducers<ApplicationState>({
  articles: articleReducer,
  sections: sectionReducer,
  categories: cateogryReducer,
  alert: alertReducer,
  ticket: ticketReducer,
  breadcrumbs: breadcrumbReducer,
  user: userInfoReducer,
  chat: chatReducer,
  redmartOrders: redmartOrderReducer
});
