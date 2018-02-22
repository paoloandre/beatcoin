import React, { Component } from "react";
import logo from "./logo.svg";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
const ReactDOM = require("react-dom");
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./rootReducer";
import setAuthorizationToken from "./utils/setAuthorizationToken";
import jwt from "jsonwebtoken";
import { setCurrentUser } from "./actions/login";
import AppLayout from "./AppLayout";

// injection of tap even for material ui, otherwise it won't work
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

//creating the redux store here
// we basically create a store that contains all of our states, and
// add to it the thunk middleware that is for used for asynchronous calls,
// basically using .then()
// after returning a promise, we can then chain another promise, all of it in an asynchronous maner
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);


// keep the jwt token saved in the localstorage
if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  const userInfo = jwt.decode(localStorage.jwtToken);
  // we only store the stuff we need in the redux, we don't need the rest occupying memory in the store
  store.dispatch(setCurrentUser(userInfo._doc));
}

// we initalize our Main component
// we enclose in an MuiThemProvider that basically gives us all the elements of Material UI
// the AppLayout is component that is part of the App
// the layout contains all the other elements of the app
class App extends Component {
  render() {
    const a = 5;
    return (
      <MuiThemeProvider>
        <AppLayout />
      </MuiThemeProvider>
    );
  }
}

// Here react proceeds to render The App in the dom and is enclosed in another Provider, the Redux,
// redux is now binded to react at this point
ReactDOM.render(
  // redux provider store
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

export default App;
