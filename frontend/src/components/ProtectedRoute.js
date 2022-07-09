import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { HomeContext } from "../App";

function ProtectedRoute({ component: Component, isAuth, ...rest }) {
  const { token } = useContext(HomeContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth) {
          return token ? <Redirect to="/" /> : <Component {...props} />;
        } else {
          return token ? <Component {...props} /> : <Redirect to="/login" />;
        }
      }}
    ></Route>
  );
}

export default ProtectedRoute;
