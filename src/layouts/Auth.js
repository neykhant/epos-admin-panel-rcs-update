/*!

=========================================================
* Argon Dashboard PRO React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react library for routing
import {
  useLocation,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import routes from "routes.js";

function Auth() {
  const location = useLocation();
  const mainContentRef = React.useRef(null);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
    document.body.classList.add("bg-white");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.remove("bg-white");
    };
  });
  React.useEffect(() => {
    if (!mountedRef.current) return null;

    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
    return () => {
      mountedRef.current = false;
    };
  }, [location]);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            exact
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className="main-content" ref={mainContentRef}>
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/auth/login" />
          </Switch>
      </div>
    </>
  );
}

export default Auth;
