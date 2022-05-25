import React from "react";
// core components
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import { call } from "services/api";

const Dashboard = () => {
  const [categories, setCategories] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [merchants, setMerchants] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const mountedRef = React.useRef(true);

  const getCategories = async () => {
    if (!mountedRef.current) return null;
    try {
      const response = await call("get", "categories");
      const result = response.data;

      setCategories(result);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getCustomers = async () => {
    if (!mountedRef.current) return null;
    try {
      const response = await call("get", "customers");
      const result = response.data;

      setCustomers(result);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getMerchants = async () => {
    if (!mountedRef.current) return null;
    try {
      const response = await call("get", "merchants");
      const result = response.data;

      setMerchants(result);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getItems = async () => {
    if (!mountedRef.current) return null;
    try {
      const response = await call("get", "items");
      const result = response.data;

      setItems(result);
    } catch (error) {
      console.log(error.response);
    }
  };

  React.useEffect(() => {
    getCategories();
    getCustomers();
    getMerchants();
    getItems();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <Container className="mt-6" fluid>
      <Row>
        <Col md="6" xl="3">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Categories
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {categories.length}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                    <i className="ni ni-active-40" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" xl="3">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Customers
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {customers.length}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                    <i className="ni ni-chart-pie-35" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" xl="3">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Merchants
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {merchants.length}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                    <i className="ni ni-money-coins" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" xl="3">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Items
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {items.length}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                    <i className="ni ni-chart-bar-32" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
