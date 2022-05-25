import React from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// reactstrap components
import { Container, Row, Col, Card } from "reactstrap";
// core components
import { call } from "services/api";
import ExportButton from "utils/exportButton";

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

const Yearly = ({ match }) => {
  const componentRef = React.useRef(null);
  const [yearly, setYearly] = React.useState([]);
  const mountedRef = React.useRef(true);

  const getYearly = React.useCallback(async () => {
    if (!mountedRef.current) return null;
    try {
      const { shopid } = match.params;
      const response = await call("get", `yearly/${shopid}`);
      const result = response.data;

      setYearly(result);
    } catch (error) {
      console.log(error.response);
    }
  }, [match.params]);

  React.useEffect(() => {
    getYearly();

    return () => {
      mountedRef.current = false;
    };
  }, [getYearly]);

  return (
    <Container className="mt-6" fluid>
      <Card>
        <ToolkitProvider
          data={yearly}
          keyField="year"
          exportCSV
          columns={[
            {
              dataField: "year",
              text: "Year",
              sort: true,
            },
            {
              dataField: "purchase_total",
              text: "Purchase Total",
              sort: true,
            },
            {
              dataField: "sale_record_total",
              text: "Sale Record Total",
              sort: true,
            },
            {
              dataField: "final_total",
              text: "Grand Total",
              sort: true,
            },
            {
              dataField: "paid",
              text: "Paid",
              sort: true,
            },
            {
              dataField: "credit",
              text: "Credit",
              sort: true,
            },
          ]}
          search
        >
          {(props) => (
            <div className="py-4 table-responsive">
              <Container fluid>
                <Row>
                  <Col xs={12} sm={6}>
                    <h1>Yearly</h1>
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

export default Yearly;
