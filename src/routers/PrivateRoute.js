import { Route, Redirect } from "react-router-dom";
import { getToken } from "utils/token";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const TOKEN = getToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        TOKEN ? <Component {...props} /> : <Redirect to="/auth/login" />
      }
    />
  );
};

export default PrivateRoute;
