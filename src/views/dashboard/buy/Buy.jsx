import React from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
// reactstrap components
import { Container, Row, Col, Card, Alert } from "reactstrap";
// core components
import { call } from "services/api";
import { getReadableDateDisplay } from "utils/convertToHumanReadableTime";

const Buy = ({ match }) => {
  const componentRef = React.useRef(null);
  const [buy, setBuy] = React.useState(null);
  const [singleBuys, setSingleBuys] = React.useState([]);
  const [buyCredits, setBuyCredits] = React.useState([]);
  const mountedRef = React.useRef(true);

  const getBuy = React.useCallback(async () => {
    if (!mountedRef.current) return null;
    try {
      const { shopid } = match.params;
      const response = await call("get", `buy/${shopid}`);
      const result = response.data;

      setBuy(result);

      const transformSingleBuys = result.single_buys.map((singleBuy, index) => {
        return {
          ...singleBuy,
          key: index + 1,
        };
      });

      setSingleBuys(transformSingleBuys);

      const transformBuyCredits = result.buy_credits.map((buyCredit, index) => {
        return {
          ...buyCredit,
          key: index + 1,
        };
      });

      setBuyCredits(transformBuyCredits);
    } catch (error) {
      console.log(error.response);
    }
  }, [match.params]);

  React.useEffect(() => {
    getBuy();

    return () => {
      mountedRef.current = false;
    };
  }, [getBuy]);

  if (buy == null) {
    return (
      <Alert color="secondary">
        <strong>Loading! </strong> Please wait a second!
      </Alert>
    );
  }

  return (
    <Container className="mt-6" fluid>
      <Card>
        <ToolkitProvider
          data={singleBuys}
          keyField="id"
          columns={[
            {
              dataField: "key",
              text: "#",
            },
            {
              dataField: "item.name",
              text: "Item Name",
            },
            {
              dataField: "price",
              text: "Price",
            },
            {
              dataField: "quantity",
              text: "Quantity",
            },
            {
              dataField: "subtotal",
              text: "Subtotal",
            },
          ]}
          search
        >
          {(props) => (
            <div className="py-4 table-responsive">
              <Container fluid>
                <Row>
                  <Col xs={12} sm={6}>
                    <h1>Purchase Detail</h1>
                  </Col>
                  <Col xs={12} sm={2}>
                    <h3>{buy.merchant_name}</h3>
                  </Col>
                  <Col xs={12} sm={4}>
                    <h3>{getReadableDateDisplay(buy.created_at)}</h3>
                  </Col>
                </Row>
              </Container>
              <BootstrapTable
                ref={componentRef}
                {...props.baseProps}
                bootstrap4={true}
                bordered={false}
                id="react-bs-table"
              />
            </div>
          )}
        </ToolkitProvider>
        <Row className="ml-7">
          <Col xs={9} sm={9}>
            <p>Grand Total</p>
          </Col>
          <Col xs={1} sm={1}>
            <p className="float-right">{buy.whole_total}</p>
          </Col>
          <Col xs={2} sm={2}></Col>
        </Row>
        <Row className="ml-7">
          <Col xs={9} sm={9}>
            <p>Paid</p>
          </Col>
          <Col xs={1} sm={1}>
            <p className="float-right">{buy.paid}</p>
          </Col>
          <Col xs={2} sm={2}></Col>
        </Row>
        <Row className="ml-7">
          <Col xs={9} sm={9}>
            <p>Credit</p>
          </Col>
          <Col xs={1} sm={1}>
            <p className="float-right">{buy.credit}</p>
          </Col>
          <Col xs={2} sm={2}></Col>
        </Row>
        <ToolkitProvider
          data={buyCredits}
          keyField="id"
          columns={[
            {
              dataField: "key",
              text: "#",
            },
            {
              dataField: "amount",
              text: "Amount",
            },
            {
              dataField: "created_at",
              text: "Created At",
              sort: true,
              formatter: (cell) => {
                return getReadableDateDisplay(cell);
              },
            },
          ]}
          search
        >
          {(props) => (
            <div className="py-4 table-responsive">
              <Container fluid>
                <Row>
                  <Col xs={12} sm={6}>
                    <h1>Credit</h1>
                  </Col>
                </Row>
              </Container>
              <BootstrapTable
                ref={componentRef}
                {...props.baseProps}
                bootstrap4={true}
                bordered={false}
                id="react-bs-table"
              />
            </div>
          )}
        </ToolkitProvider>
      </Card>
    </Container>
  );
};

export default Buy;
