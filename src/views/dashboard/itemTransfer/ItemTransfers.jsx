import React from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// reactstrap components
import { Container, Row, Col, Card } from "reactstrap";
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

const ItemTransfers = ({ match }) => {
  const componentRef = React.useRef(null);
  const [itemTransfers, setItemTransfers] = React.useState([]);
  const mountedRef = React.useRef(true);

  const getItemTransfers = React.useCallback(async () => {
    if (!mountedRef.current) return null;
    try {
      const { shopid } = match.params;
      const response = await call("get", `item-transfers/${shopid}`);
      const result = response.data.map((data, index) => {
        return {
          ...data,
          key: index + 1,
        };
      });

      setItemTransfers(result);
    } catch (error) {
      console.log(error.response);
    }
  }, [match.params]);

  React.useEffect(() => {
    getItemTransfers();

    return () => {
      mountedRef.current = false;
    };
  }, [getItemTransfers]);

  return (
    <Container className="mt-6" fluid>
      <Card>
        <ToolkitProvider
          data={itemTransfers}
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
              dataField: "to_shop.name",
              text: "To Shop",
              sort: true,
            },
            {
              dataField: "quantity",
              text: "Quantity",
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
                  <Col xs={12} sm={3}>
                    <h1>Item Transfers</h1>
                  </Col>
                  <Col xs={12} sm={3}></Col>
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

export default ItemTransfers;
