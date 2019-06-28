# Redux Store

This directory contains all redux [actions](https://redux.js.org/basics/actions), action creators, [store state](https://redux.js.org/basics/store) and [reducers](https://redux.js.org/basics/reducers).


## Actions
Actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using `store.dispatch()`.

Actions are plain JavaScript objects. Actions must have a `type` property that indicates the type of action being performed. Other than `type`, the structure of an action object is really up to you.

Example:
```Json
{
  type: "ADD_TODO",
  text: "Build my first Redux app"
}
```

## Action Creators
Action creators are exactly that—functions that create actions. Unlike Flux, action creators do not dispatch the call. Instead, to actually initiate a dispatch, pass the result to the `dispatch()` function.

Example:
```JS
function addTodo(text) {
  return {
    type: "ADD_TODO",
    text
  }
}

dispatch(addTodo(text))
```

## State
In Redux, all the application state is stored as a single object. Example:
```Json
{
  visibilityFilter: "SHOW_ALL",
  todos: [
    {
      text: "Consider using Redux",
      completed: true
    },
    {
      text: "Keep all state in a single tree",
      completed: false
    }
  ]
}
```

## Reducers
Reducers specify how the application's state changes in response to actions sent to the store. Remember that actions only describe what happened, but don't describe how the application's state changes.

The reducer is a pure function that takes the previous state and an action, and returns the next state.
```Js
(previousState, action) => newState
```

Things you should *never* do inside a reducer:
- Mutate its arguments;
- Perform side effects like API calls and routing transitions;
- Call non-pure functions, e.g. `Date.now()` or `Math.random()`.
