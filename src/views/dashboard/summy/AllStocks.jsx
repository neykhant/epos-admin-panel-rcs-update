import React, { useEffect } from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// reactstrap components
import { Container, Row, Col, Card, Alert } from "reactstrap";
// core components
import useQuery from "hooks/useQuery";

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

const AllStocks = () => {
  const [transformStocks, setTransformStocks] = React.useState([]);
  const componentRef = React.useRef(null);

  const {
    response: stocks,
    error: stockError,
    loading: stockLoading,
  } = useQuery("get", "all-stocks");

  useEffect(() => {
    const result = stocks.map((stock, index) => {
      return {
        ...stock,
        key: index + 1,
      };
    });

    setTransformStocks(result);
  }, [stocks]);

  if (stockLoading)
    return (
      <Alert color="secondary">
        <strong>Loading! </strong> Please wait a second!
      </Alert>
    );

  if (stockError)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {stockError.message}
      </Alert>
    );

  return (
    <Container className="mt-6" fluid>
      <Card>
        <ToolkitProvider
          data={transformStocks}
          keyField="item.id"
          exportCSV
          columns={[
            {
              dataField: "key",
              text: "#",
              sort: true,
            },
            {
              dataField: "item.id",
              text: "ID",
              sort: true,
            },
            {
              dataField: "item.name",
              text: "Name",
              sort: true,
            },
            {
              dataField: "item.category.name",
              text: "Category",
              sort: true,
            },
            {
              dataField: "quantity",
              text: "Quantity",
              sort: true,
            },
          ]}
          search
        >
          {(props) => (
            <div className="py-4 table-responsive">
              <Container fluid>
                <Row>
                  <Col xs={12} sm={2}>
                    <h1>All Stocks</h1>
                  </Col>
                  <Col xs={12} sm={10}>
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

export default AllStocks;
