import React from "react";
// react plugin used to create datetimepicker
import ReactDatetime from "react-datetime";
import {
  Card,
  CardBody,
  CardText,
  Container,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Button,
  Alert,
} from "reactstrap";
import { call } from "services/api";

const Profit = ({ match }) => {
  const [profit, setProfit] = React.useState(null);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const mountedRef = React.useRef(true);

  const getProfit = React.useCallback(async () => {
    if (!mountedRef.current) return null;
    try {
      const { shopid } = match.params;
      const response = await call("get", `profit/${shopid}`);
      const result = response;

      setProfit(result);
    } catch (error) {
      console.log(error.response);
    }
  }, [match.params]);

  const filterProfit = async () => {
    try {
      const { shopid } = match.params;
      const response = await call(
        "get",
        `profit/${shopid}?start_date=${startDate}&end_date=${endDate}`
      );
      const result = response;

      setProfit(result);
    } catch (error) {
      console.log(error.response);
    }
  };

  React.useEffect(() => {
    getProfit();

    return () => {
      mountedRef.current = false;
    };
  }, [getProfit]);

  if (profit == null) {
    return (
      <Alert color="secondary">
        <strong>Loading! </strong> Please wait a second!
      </Alert>
    );
  }

  return (
    <Container className="mt-6" fluid>
      <Card className="card-frame">
        <CardBody>
          <Row>
            <Col xs={12} sm={5}>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "Start Date",
                    }}
                    onChange={(event) =>
                      setStartDate(event.format("YYYY-MM-DD"))
                    }
                    timeFormat={false}
                    dateFormat="DD-MM-YYYY"
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs={12} sm={5}>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "End Date",
                    }}
                    onChange={(event) => setEndDate(event.format("YYYY-MM-DD"))}
                    timeFormat={false}
                    dateFormat="DD-MM-YYYY"
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs={12} sm={2}>
              <Button color="success" type="button" onClick={filterProfit}>
                Check
              </Button>
            </Col>
          </Row>

          <h1>Profit</h1>
          <CardText>Purchase Total: {profit.daily.purchase_total}</CardText>
          <CardText>
            Sale Record Total: {profit.daily.sale_record_total}
          </CardText>
          {/* <CardText>Packaging Total: {profit.daily.extra_charges}</CardText> */}
          <CardText>Grand Total: {profit.daily.final_total}</CardText>
          <CardText>Paid: {profit.daily.paid}</CardText>
          <CardText>Credit: {profit.daily.credit}</CardText>
          <CardText>Expense: {profit.expense.amount}</CardText>
          <CardText>
            Gross Profit:{" "}
            {profit.daily.sale_record_total - profit.daily.purchase_total}
          </CardText>
          <CardText>
            Profit:{" "}
            {profit.daily.sale_record_total -
              profit.daily.purchase_total -
              profit.expense.amount}
          </CardText>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Profit;
