import useQuery from "hooks/useQuery";
import React, { useEffect, useState } from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { useHistory } from "react-router";
// reactstrap components
import { Container, Row, Col, Card, Button, Alert } from "reactstrap";
// core components
import { getReadableDateDisplay } from "utils/convertToHumanReadableTime";
import ExportButton from "utils/exportButton";

const pagination = paginationFactory({
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: true,
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
  )
});

const { SearchBar } = Search;

const Items = () => {
  const [transformItems, setTransformItems] = useState([]);
  const componentRef = React.useRef(null);
  const history = useHistory();

  const { response: items, error, loading } = useQuery("get", "items");

  useEffect(() => {
    const result = items.map((item, index) => {
      return {
        ...item,
        key: index + 1
      };
    });

    setTransformItems(result);
  }, [items]);

  if (loading)
    return (
      <Alert color="secondary">
        <strong>Loading! </strong> Please wait a second!
      </Alert>
    );

  if (error)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {error.message}
      </Alert>
    );

  return (
    <Container className="mt-6" fluid>
      <Card>
        <ToolkitProvider
          data={transformItems}
          keyField="id"
          exportCSV
          columns={[
            {
              dataField: "key",
              text: "#",
              sort: true
            },
            {
              dataField: "id",
              text: "ID",
              sort: true
            },
            {
              dataField: "code",
              text: "Code",
              sort: true
            },
            {
              dataField: "name",
              text: "Name",
              sort: true
            },
            {
              dataField: "category.name",
              text: "Category",
              sort: true
            },
            {
              dataField: "buy_price",
              text: "Purchase Price",
              sort: true
            },
            {
              dataField: "sale_price",
              text: "Sale Price",
              sort: true
            },
            {
              dataField: "created_at",
              text: "Created At",
              sort: true,
              formatter: (cell) => {
                return getReadableDateDisplay(cell);
              }
            }
          ]}
          search
        >
          {(props) => (
            <div className="py-4 table-responsive">
              <Container fluid>
                <Row>
                  <Col xs={12} sm={2}>
                    <h1>Items</h1>
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
                  <Col xs={12} sm={1}>
                    <Button
                      color="success"
                      type="button"
                      size="sm"
                      onClick={() => history.push("/admin/item-import")}
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

export default Items;
