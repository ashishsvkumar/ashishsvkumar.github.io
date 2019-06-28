# service-app

This is a react webapp for Self-Service. Documents are provided via `README` files under each sub-directory, whenever needed.

## NodeJS
We use node `v10.14.1` (lts).

## Installation
```
npm install 
```

## URLs
This is app is expected to function correctly from following paths:

| Sub-Path               | For Device |
|------------------------|------------|
|                        | Desktop    |
| `/m/`                  | Mobile     |
| `/customer-support/`   | Desktop    |
| `/customer-support/m/` | Mobile     |

Refer to [nginx.conf](https://gist.github.com/anurag-redmart/67b121583efaa94e39b77866fe0dcf24) to for details.

## HTML Templates
We are using Lazada's common components as the skeleton of this app. See:
- [`head`](http://selfservice-api.alpha.redmart.com/v1.0.0/support/icms/head)
- [`Mobile Header`](http://selfservice-api.alpha.redmart.com/v1.0.0/support/icms/header)
- [`Mobile Footer`](http://selfservice-api.alpha.redmart.com/v1.0.0/support/icms/footer)
- [`Desktop Header`](http://selfservice-api.alpha.redmart.com/v1.0.0/support/icms/header?device=desktop)
- [`Desktop Footer`](http://selfservice-api.alpha.redmart.com/v1.0.0/support/icms/footer?device=desktop)
- [Complete Mobile Template](http://selfservice-api.alpha.redmart.com/v1.0.0/support/icms)
- [Complete Desktop Template](http://selfservice-api.alpha.redmart.com/v1.0.0/support/icms?device=desktop)

## Library Dependencies:
- [react](https://reactjs.org/docs/getting-started.html)
- [react-dom](https://reactjs.org/docs/react-dom.html)
- [redux](https://redux.js.org/introduction/getting-started)
- [react-redux](https://redux.js.org/basics/usage-with-react)
- [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)


## Dev Dependencies
- [typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)
- [webpack](https://webpack.js.org/concepts/)
- [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/)
- [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)
- [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)
- [storybook](https://storybook.js.org/basics/writing-stories/)
