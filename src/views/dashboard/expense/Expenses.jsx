import React from "react";
import useQuery from "hooks/useQuery";
// react plugin used to create datetimepicker
import ReactDatetime from "react-datetime";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// reactstrap components
import {
  Container,
  Row,
  Col,
  Card,
  Input,
  Alert,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Button,
} from "reactstrap";
import { call } from "services/api";
// core components
import { getReadableDateDisplay } from "utils/convertToHumanReadableTime";
import ExportButton from "utils/exportButton";
import { NotificationManager } from "react-notifications";

const pagination = paginationFactory({
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: false,
  sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
    <div className="dataTables_length" id="datatable-basic_length">
      <label>
        Show{" "}
        {
          <select
            name="datatable-basic_length"
            aria-controls="datatable-basic"
            className="form-control form-control-sm"
            onChange={(e) => onSizePerPageChange(e.target.value)}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        }{" "}
        entries.
      </label>
    </div>
  ),
});

const { SearchBar } = Search;

const Expenses = () => {
  const componentRef = React.useRef(null);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [transformExpenses, setTransformExpenses] = React.useState([]);
  const [filterExpenses, setFilterExpenses] = React.useState([]);

  const {
    response: expenses,
    error: expenseError,
    loading: expenseLoading,
  } = useQuery("get", "expenses");
  const {
    response: shops,
    error: shopError,
    loading: shopLoading,
  } = useQuery("get", "shops");

  React.useEffect(() => {
    const result = expenses.map((expense, index) => {
      return {
        ...expense,
        key: index + 1,
      };
    });

    setTransformExpenses(result);
    setFilterExpenses(result);
  }, [expenses]);

  const handleSelectShop = (shopID) => {
    if (shopID === "all") {
      setFilterExpenses(transformExpenses);
    } else {
      const filterExpensesByShopID = transformExpenses.filter(
        (expense) => expense.shop_id === shopID
      );
      setFilterExpenses(filterExpensesByShopID);
    }
  };

  const filterProfit = async () => {
    try {
      const response = await call(
        "get",
        `expenses?start_date=${startDate}&end_date=${endDate}`
      );
      const result = response.data.map((data, index) => {
        return {
          ...data,
          key: index + 1,
        };
      });

      setFilterExpenses(result);
    } catch (error) {
      NotificationManager.error("Something was wrong!");
    }
  };

  const total =
    filterExpenses.length > 0
      ? filterExpenses
          .map((expense) => Number(expense.amount))
          .reduce((a, b) => a + b)
      : 0;

  if (expenseLoading || shopLoading)
    return (
      <Alert color="secondary">
        <strong>Loading! </strong> Please wait a second!
      </Alert>
    );

  if (expenseError)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {expenseError.message}
      </Alert>
    );

  if (shopError)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {shopError.message}
      </Alert>
    );

  return (
    <Container className="mt-6" fluid>
      <Card>
        <ToolkitProvider
          data={filterExpenses}
          keyField="id"
          exportCSV
          columns={[
            {
              dataField: "key",
              text: "#",
              sort: true,
            },
            {
              dataField: "id",
              text: "ID",
              sort: true,
            },
            {
              dataField: "name",
              text: "Name",
              sort: true,
            },
            {
              dataField: "amount",
              text: "Amount",
              sort: true,
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
                  <Col xs={12} sm={2}>
                    <h1>Expenses</h1>
                  </Col>
                  <Col xs={12} sm={4}>
                    <div className="custom-control-inline mt-1">
                      <label htmlFor="shops" className="mr-1 mt-1">
                        Shop:
                      </label>
                      <Input
                        id="shops"
                        type="select"
                        className="form-control-sm"
                        onChange={(event) =>
                          handleSelectShop(event.target.value)
                        }
                      >
                        <option value="all">All</option>
                        {shops.map((data) => (
                          <option value={data.id} key={data.id}>
                            {data.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                  </Col>
                  <Col xs={12} sm={4}>
                    <div
                      id="datatable-basic_filter"
                      className="dataTables_filter px-4 pb-1 float-right"
                    >
                      <label>
                        Search:
                        <SearchBar
                          className="form-control-sm"
                          placeholder=""
                          {...props.searchProps}
                        />
                      </label>
                    </div>
                  </Col>
                  <Col xs={12} sm={2}>
                    <ExportButton {...props.csvProps} />
                  </Col>
                </Row>
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
                          onChange={(event) =>
                            setEndDate(event.format("YYYY-MM-DD"))
                          }
                          timeFormat={false}
                          dateFormat="DD-MM-YYYY"
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={2}>
                    <Button
                      color="success"
                      type="button"
                      onClick={filterProfit}
                      size="sm"
                    >
                      Check
                    </Button>
                  </Col>
                </Row>
                <Row className="ml-7">
                  <Col>
                    <p className="float-right">Total - {total}</p>
                  </Col>
                </Row>
              </Container>
              <BootstrapTable
                ref={componentRef}
                {...props.baseProps}
                bootstrap4={true}
                pagination={pagination}
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

export default Expenses;
