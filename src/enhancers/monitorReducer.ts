import * as log from "loglevel";
import { ApplicationState } from "../store";

const round = (num: number) => Math.round(num * 100) / 100;

const monitorReducerEnhancer = (createStore: any) => (
  reducer: any,
  initialState: ApplicationState,
  enhancer: any,
) => {
  const monitoredReducer = (state: ApplicationState, action: any) => {
    const start = performance.now();
    const newState = reducer(state, action);
    const end = performance.now();
    const diff = round(end - start);

    log.trace("reducer process time:", diff);
    return newState;
  };

  return createStore(monitoredReducer, initialState, enhancer);
};

export default monitorReducerEnhancer;
