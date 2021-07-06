import React from "react";

import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import StaffPage from "./pages/StaffPage";
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
        <Route path="/staff/:id" component={StaffPage} exact={true} />
        <Route render={() => <Redirect to="/" />} />
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

        <Route render={() => <Redirect to="/" />} />
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
