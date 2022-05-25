import React from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { useHistory } from "react-router";
// reactstrap components
import { Container, Row, Col, Card, Button } from "reactstrap";
// core components
import { call } from "services/api";
import { getReadableDateDisplay } from "utils/convertToHumanReadableTime";
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

const Prices = ({ match }) => {
  const componentRef = React.useRef(null);
  const [prices, setPrices] = React.useState([]);
  const mountedRef = React.useRef(true);

  const history = useHistory();

  const getPrices = React.useCallback(async () => {
    if (!mountedRef.current) return null;
    try {
      const { shopid, regionid } = match.params;
      const response = await call("get", `prices/${shopid}/${regionid}`);
      const result = response.data;

      setPrices(result);
    } catch (error) {
      console.log(error.response);
    }
  }, [match.params]);

  React.useEffect(() => {
    getPrices();

    return () => {
      mountedRef.current = false;
    };
  }, [getPrices]);

  return (
    <Container className="mt-6" fluid>
      <Card>
        <ToolkitProvider
          data={prices}
          keyField="id"
          exportCSV
          columns={[
            {
              dataField: "id",
              text: "ID",
              sort: true,
            },
            {
              dataField: "item.code",
              text: "Code",
              sort: true,
            },
            {
              dataField: "item.name",
              text: "Name",
              sort: true,
            },
            {
              dataField: "item.left_item",
              text: "Left Item",
              sort: true,
            },
            {
              dataField: "item.buy_price",
              text: "Buy Price",
              sort: true,
            },
            {
              dataField: "sale_price",
              text: "Sale Price",
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
                  <Col xs={12} sm={6}>
                    <h1>Prices</h1>
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
                  <Col xs={12} sm={1}>
                    <Button
                      color="success"
                      type="button"
                      size="sm"
                      onClick={() => history.push("/admin/price-import")}
                    >
                      Import
                    </Button>
                  </Col>
                  <Col xs={12} sm={1}>
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

export default Prices;
