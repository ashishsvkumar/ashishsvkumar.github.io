import { applyMiddleware, compose, createStore } from "redux";
import monitorReducer from "../enhancers/monitorReducer";
import { initialState, rootReducer } from "./";
import thunkMiddleware from 'redux-thunk'
import { currentEnvironment, Environments } from "../config/environment";

export default function configureStore() {
  const middlewares: any[] = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer, monitorReducer];
  let composedEnhancers: any;

  if (currentEnvironment === Environments.production) {
    composedEnhancers = compose(...enhancers);
  } else {
    // @ts-ignore
    const devtoolCompose: any = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    composedEnhancers = devtoolCompose(...enhancers);
  }

  const store = createStore(rootReducer, initialState, composedEnhancers);
  return store;
}
