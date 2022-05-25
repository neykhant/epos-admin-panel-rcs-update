import React from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
// reactstrap components
import { Container, Row, Col, Card, Alert } from "reactstrap";
// core components
import { call } from "services/api";
import { getReadableDateDisplay } from "utils/convertToHumanReadableTime";

const Sale = ({ match }) => {
  const componentRef = React.useRef(null);
  const [sale, setSale] = React.useState(null);
  const [singleSales, setSingleSales] = React.useState([]);
  const [credits, setCredits] = React.useState([]);
  const mountedRef = React.useRef(true);

  const getSale = React.useCallback(async () => {
    if (!mountedRef.current) return null;
    try {
      const { shopid } = match.params;
      const response = await call("get", `sale/${shopid}`);
      const result = response.data;

      setSale(result);

      const transformSingleSales = result.single_sales.map(
        (singleSale, index) => {
          return {
            ...singleSale,
            key: index + 1,
          };
        }
      );

      setSingleSales(transformSingleSales);

      const transformCredits = result.credits.map((credit, index) => {
        return {
          ...credit,
          key: index + 1,
        };
      });

      setCredits(transformCredits);
    } catch (error) {
      console.log(error.response);
    }
  }, [match.params]);

  React.useEffect(() => {
    getSale();

    return () => {
      mountedRef.current = false;
    };
  }, [getSale]);

  if (sale == null) {
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
          data={singleSales}
          keyField="id"
          columns={[
            {
              dataField: "key",
              text: "#",
            },
            {
              dataField: "stock.item.name",
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
                    <h1>Sale Detail</h1>
                  </Col>
                  <Col xs={12} sm={2}>
                    <h3>{sale.customer_name}</h3>
                  </Col>
                  <Col xs={12} sm={4}>
                    <h3>{getReadableDateDisplay(sale.created_at)}</h3>
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
            <p>Sale Total</p>
          </Col>
          <Col xs={1} sm={1}>
            <p className="float-right">{sale.sale_record_total}</p>
          </Col>
          <Col xs={2} sm={2}></Col>
        </Row>
        <Row className="ml-7">
          <Col xs={9} sm={9}>
            <p>Discount({sale.discount})%</p>
          </Col>
          <Col xs={1} sm={1}>
            <p className="float-right">
              {sale.sale_record_total * (Number(sale.discount) / 100)}
            </p>
          </Col>
          <Col xs={2} sm={2}></Col>
        </Row>
        <Row className="ml-7">
          <Col xs={9} sm={9}>
            <p>Grand Total</p>
          </Col>
          <Col xs={1} sm={1}>
            <p className="float-right">{sale.final_total}</p>
          </Col>
          <Col xs={2} sm={2}></Col>
        </Row>
        <Row className="ml-7">
          <Col xs={9} sm={9}>
            <p>Paid</p>
          </Col>
          <Col xs={1} sm={1}>
            <p className="float-right">{sale.paid}</p>
          </Col>
          <Col xs={2} sm={2}></Col>
        </Row>
        <Row className="ml-7">
          <Col xs={9} sm={9}>
            <p>Credit</p>
          </Col>
          <Col xs={1} sm={1}>
            <p className="float-right">{sale.credit}</p>
          </Col>
          <Col xs={2} sm={2}></Col>
        </Row>
        <ToolkitProvider
          data={credits}
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

export default Sale;
