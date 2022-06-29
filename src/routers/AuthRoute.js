import { Route, Redirect } from "react-router-dom";
import { getToken } from "utils/token";

const AuthRoute = ({ component: Component, ...rest }) => {
  const TOKEN = getToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        !TOKEN ? <Component {...props} /> : <Redirect to="/admin/dashboard" />
      }
    />
  );
};

export default AuthRoute;
