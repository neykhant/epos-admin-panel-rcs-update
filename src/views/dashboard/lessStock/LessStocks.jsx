import useQuery from "hooks/useQuery";
import React from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// reactstrap components
import { Container, Row, Col, Card, Input, Button, Alert } from "reactstrap";
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

const LessStocks = () => {
  const componentRef = React.useRef(null);
  const [stock, setStock] = React.useState(10);
  const [transformLessStocks, setTransformLessStocks] = React.useState([]);
  const [filterLessStocks, setFilterLessStocks] = React.useState([]);
  const mountedRef = React.useRef(true);

  const getLessStocks = async () => {
    if (!mountedRef.current) return null;
    try {
      const response = await call("get", `low-items/${stock}`);
      const result = response.data.map((data, index) => {
        return {
          ...data,
          key: index + 1,
        };
      });

      setTransformLessStocks(result);
      setFilterLessStocks(result);
    } catch (error) {
      console.log(error.response);
    }
  };

  const {
    response: lessStocks,
    error: lessStockError,
    loading: lessStockLoading,
  } = useQuery("get", `low-items/${stock}`);
  const {
    response: shops,
    error: shopError,
    loading: shopLoading,
  } = useQuery("get", "shops");

  React.useEffect(() => {
    const result = lessStocks.map((lessStock, index) => {
      return {
        ...lessStock,
        key: index + 1,
      };
    });

    setTransformLessStocks(result);
    setFilterLessStocks(result);
  }, [lessStocks]);

  const handleSelectShop = (shopID) => {
    if (shopID === "all") {
      setFilterLessStocks(transformLessStocks);
    } else {
      const filterLessStocksByShopID = transformLessStocks.filter(
        (lessStock) => lessStock.shop_id === shopID
      );
      setFilterLessStocks(filterLessStocksByShopID);
    }
  };

  if (lessStockLoading || shopLoading)
    return (
      <Alert color="secondary">
        <strong>Loading! </strong> Please wait a second!
      </Alert>
    );

  if (lessStockError)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {lessStockError.message}
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
          data={filterLessStocks}
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
              dataField: "item.name",
              text: "Name",
              sort: true,
            },
            {
              dataField: "item.code",
              text: "Code",
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
                  <Col xs={12} sm={2}>
                    <h1>Less Stocks</h1>
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
                <Row className="mb-3">
                  <Col xs={12} lg={3}>
                    <Input
                      type="number"
                      placeholder="Enter filter stock"
                      value={stock}
                      onChange={(event) => setStock(event.target.value)}
                      style={{ width: "180px", height: "30px" }}
                    />
                  </Col>
                  <Col xs={12} lg={2}>
                    <Button
                      color="success"
                      type="button"
                      size="sm"
                      onClick={() => {
                        mountedRef.current = true;
                        getLessStocks();
                      }}
                    >
                      Stock Filter
                    </Button>
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

export default LessStocks;
