import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserState } from "./providers/UserProvider";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login" render={() => <Redirect to="/" />} exact={true} />
      </Switch>
    </Router>
  );
}

function UnAuthApp() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>

        <Route path="/login" exact>
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default function AuthOrDefault() {
  const user = useUserState();

  if (user) {
    return <App />;
  } else {
    return <UnAuthApp />;
  }
}
