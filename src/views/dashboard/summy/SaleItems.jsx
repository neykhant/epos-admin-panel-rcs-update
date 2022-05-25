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

const SaleItems = ({ match }) => {
  const componentRef = React.useRef(null);
  const [filterSaleItems, setFilterSaleItems] = React.useState([]);
  const mountedRef = React.useRef(true);

  const getSaleItems = React.useCallback(async () => {
    if (!mountedRef.current) return null;
    try {
      const { shopid } = match.params;
      const response = await call("get", `daily-sale-items/${shopid}`);
      const result = response.data.map((data, index) => {
        return {
          ...data,
          key: index + 1,
        };
      });

      setFilterSaleItems(result);
    } catch (error) {
      console.log(error.response);
    }
  }, [match.params]);

  React.useEffect(() => {
    getSaleItems();

    return () => {
      mountedRef.current = false;
    };
  }, [getSaleItems]);

  return (
    <Container className="mt-6" fluid>
      <Card>
        <ToolkitProvider
          data={filterSaleItems}
          keyField="key"
          exportCSV
          columns={[
            {
              dataField: "key",
              text: "#",
              sort: true,
            },
            {
              dataField: "day",
              text: "Day",
              sort: true,
            },
            {
              dataField: "stock.item.name",
              text: "Name",
              sort: true,
            },
            {
              dataField: "quantity",
              text: "Quantity",
              sort: true,
            },
            {
              dataField: "subtotal",
              text: "Total",
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
                    <h1>Sale Items</h1>
                  </Col>
                  <Col xs={12} sm={4}></Col>
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

export default SaleItems;
