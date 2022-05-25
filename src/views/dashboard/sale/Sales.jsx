import React from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// reactstrap components
import { Container, Row, Col, Card, Button, Input, Alert } from "reactstrap";
// core components
import { useHistory } from "react-router";
import { getReadableDateDisplay } from "utils/convertToHumanReadableTime";
import ExportButton from "utils/exportButton";
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

const Sales = () => {
  const componentRef = React.useRef(null);
  const [transformSales, setTransformSales] = React.useState([]);
  const [filterSales, setFilterSales] = React.useState([]);

  const history = useHistory();

  const {
    response: sales,
    error: saleError,
    loading: saleLoading,
  } = useQuery("get", "sales");
  const {
    response: shops,
    error: shopError,
    loading: shopLoading,
  } = useQuery("get", "shops");

  React.useEffect(() => {
    const result = sales.map((sale, index) => {
      return {
        ...sale,
        key: index + 1,
      };
    });

    setTransformSales(result);
    setFilterSales(result);
  }, [sales]);

  const handleSelectShop = (shopID) => {
    if (shopID === "all") {
      setFilterSales(transformSales);
    } else {
      const filterSalesByShopID = transformSales.filter(
        (sale) => sale.shop_id === shopID
      );
      setFilterSales(filterSalesByShopID);
    }
  };

  if (saleLoading || shopLoading)
    return (
      <Alert color="secondary">
        <strong>Loading! </strong> Please wait a second!
      </Alert>
    );

  if (saleError)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {saleError.message}
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
          data={filterSales}
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
              dataField: "customer_name",
              text: "Customer Name",
              sort: true,
            },
            {
              dataField: "purchase_total",
              text: "Purchase Total",
              sort: true,
            },
            {
              dataField: "sale_record_total",
              text: "Sale Total",
              sort: true,
            },
            // {
            //   dataField: "extra_charges",
            //   text: "Packaging",
            //   sort: true,
            // },
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
            {
              dataField: "remark",
              text: "Remark",
              sort: true,
            },
            {
              dataField: "note",
              text: "Note",
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
              text: "Detail",
              dataField: "detail",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() => history.push(`/admin/sales/${row.id}`)}
                >
                  Detail
                </Button>
              ),
            },
            {
              text: "Print",
              dataField: "print",
              isDummyField: true,
              formatter: (_, row) => (
                <Button
                  color="info"
                  type="link"
                  size="sm"
                  onClick={() => history.push(`/admin/print-sale/${row.id}`)}
                >
                  Print
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
                  <Col xs={12} sm={2}>
                    <h1>Sales</h1>
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

export default Sales;
