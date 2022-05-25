import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import { call } from "services/api";
import { NotificationManager } from "react-notifications";
import { storeToken } from "utils/token";
import { setAccessToken } from "services/api";
import { useHistory } from "react-router";
// core components

const Login = () => {
  const [focusedEmail, setfocusedEmail] = React.useState(false);
  const [focusedPassword, setfocusedPassword] = React.useState(false);
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  const handleSubmit = async () => {
    setLoading((prev) => !prev);
    try {
      const response = await call("post", "io-login", { email, password });
      const result = response.data;

      storeToken(result.access_token);
      setAccessToken(result.access_token);
      history.replace("/admin");
    } catch (error) {
      if (error.response.status === 401) {
        NotificationManager.error(error.response.data.data.message);
      }
      if (error.response.status === 400) {
        NotificationManager.error(error.response.data.message);
      }
    }
    setLoading((prev) => !prev);
  };

  return (
    <Container className="mt-5 pb-5">
      <Row className="justify-content-center">
        <Col lg="5" md="7">
          <Card className="bg-secondary border-0 mb-0">
            <CardHeader
              className="text-center mb-4 text-white"
              style={{ backgroundColor: "#543125" }}
            >
              RCS EPOS Login
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-3">
              <Form role="form">
                <FormGroup
                  className={classnames("mb-3", {
                    focused: focusedEmail,
                  })}
                >
                  <InputGroup className="input-group-merge input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      onFocus={() => setfocusedEmail(true)}
                      onBlur={() => setfocusedEmail(true)}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup
                  className={classnames({
                    focused: focusedPassword,
                  })}
                >
                  <InputGroup className="input-group-merge input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      onFocus={() => setfocusedPassword(true)}
                      onBlur={() => setfocusedPassword(true)}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Button
                    style={{ backgroundColor: "#543125", color: "#ffffff" }}
                    className="my-4"
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Loading" : "Sign In"}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
