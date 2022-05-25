import React, { useEffect, useState } from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// reactstrap components
import { Container, Row, Col, Card, Button, Alert } from "reactstrap";
import { useHistory } from "react-router";
import { getReadableDateDisplay } from "utils/convertToHumanReadableTime";
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

const Shops = () => {
  const [transformShops, setTransformShops] = useState([]);
  const componentRef = React.useRef(null);
  const history = useHistory();

  const { response: shops, error, loading } = useQuery("get", "shops");

  useEffect(() => {
    const result = shops.map((shop, index) => {
      return {
        ...shop,
        key: index + 1,
      };
    });

    setTransformShops(result);
  }, [shops]);

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
          data={transformShops}
          keyField="id"
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
              dataField: "employees",
              text: "No of Employees",
              sort: true,
            },
            {
              dataField: "address",
              text: "Address",
              sort: true,
            },
            {
              dataField: "phone_no_one",
              text: "Phone No One",
              sort: true,
            },
            {
              dataField: "phone_no_two",
              text: "Phone No Two",
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
            {
              text: "Create Sale",
              dataField: "create-sales",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() => history.push(`/admin/create-sale/${row.id}`)}
                >
                  Create Sale
                </Button>
              ),
            },
            {
              text: "More Sale",
              dataField: "more-sales",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() => history.push(`/admin/more-sales/${row.id}`)}
                >
                  More Sales
                </Button>
              ),
            },
            {
              text: "Gross Profit Items",
              dataField: "gross-profit-items",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() =>
                    history.push(`/admin/gross-profit-items/${row.id}`)
                  }
                >
                  Gross Profit Items
                </Button>
              ),
            },
            {
              text: "Sale Items",
              dataField: "sale-items",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() => history.push(`/admin/sale-items/${row.id}`)}
                >
                  Sale Items
                </Button>
              ),
            },
            {
              text: "Item Transfer",
              dataField: "item-transfer",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() =>
                    history.push(`/admin/item-transfers/${row.id}`)
                  }
                >
                  Item Transfers
                </Button>
              ),
            },
            {
              text: "Daily",
              dataField: "daily",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() => history.push(`/admin/daily/${row.id}`)}
                >
                  Daily
                </Button>
              ),
            },
            {
              text: "Monthly",
              dataField: "monthly",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() => history.push(`/admin/monthly/${row.id}`)}
                >
                  Monthly
                </Button>
              ),
            },
            {
              text: "Yearly",
              dataField: "yearly",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() => history.push(`/admin/yearly/${row.id}`)}
                >
                  Yearly
                </Button>
              ),
            },
            {
              text: "Profit",
              dataField: "profit",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() => history.push(`/admin/profit/${row.id}`)}
                >
                  Profit
                </Button>
              ),
            },
          ]}
          search
        >
          {(props) => (
            <div className="py-4 table-responsive">
              <Container fluid>
                <Row>
                  <Col xs={12} sm={6}>
                    <h1>Shops</h1>
                  </Col>
                  <Col xs={12} sm={6}>
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

export default Shops;
