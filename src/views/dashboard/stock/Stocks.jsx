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
import { NotificationManager } from "react-notifications";
import { useHistory } from "react-router";
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
  )
});

const { SearchBar } = Search;

const Stocks = () => {
  const componentRef = React.useRef(null);
  const [transformStocks, setTransfromStocks] = React.useState([]);
  const [filterStocks, setFilterStocks] = React.useState([]);

  const history = useHistory();

  const {
    response: stocks,
    error: stockError,
    loading: stockLoading
  } = useQuery("get", "stocks");
  const {
    response: shops,
    error: shopError,
    loading: shopLoading
  } = useQuery("get", "shops");

  React.useEffect(() => {
    const result = stocks.map((stock, index) => {
      return {
        ...stock,
        key: index + 1
      };
    });
    setTransfromStocks(result);
    setFilterStocks(result);
  }, [stocks]);

  const handleSelectShop = (shopID) => {
    if (shopID === "all") {
      setFilterStocks(transformStocks);
    } else {
      const filterStocksByShopID = transformStocks.filter(
        (stock) => stock.shop_id === shopID
      );
      setFilterStocks(filterStocksByShopID);
    }
  };

  const handleOnChange = async (row) => {
    const stock = document.getElementById(`quantity${row.id}`).value;

    if (stock === "") {
      NotificationManager.warning("Please enter stock!");
    } else {
      const response = await call("post", `stocks/${row.id}?_method=put`, {
        shop_id: Number(row.shop_id),
        item_id: row.item.id,
        quantity: Number(stock)
      });
      // console.log(response);
      if (response.status === "success") {
        NotificationManager.success("Stock has been updated successfully!");
        document.getElementById(`quantity${row.id}`).value = "";
        try {
          const response = await call("get", "stocks");
          const result = response.data;

          setFilterStocks(result);
        } catch (error) {
          NotificationManager.error("Something was wrong!");
        }
      } else {
        NotificationManager.error("Something was wrong!");
      }
    }
  };

  if (stockLoading || shopLoading)
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
          data={filterStocks}
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
              dataField: "item.name",
              text: "Name",
              sort: true
            },
            {
              dataField: "item.category.name",
              text: "Category",
              sort: true
            },
            {
              dataField: "quantity",
              text: "Quantity",
              sort: true
            },
            {
              dataField: "created_at",
              text: "Created At",
              sort: true,
              formatter: (cell) => {
                return getReadableDateDisplay(cell);
              }
            },
            {
              dataField: "",
              text: "Action",
              formatter: (_, row) => {
                return (
                  <Row>
                    <Col>
                      <Input
                        type="number"
                        id={`quantity${row.id}`}
                        style={{ width: "180px", height: "30px" }}
                      />
                    </Col>
                    <Col>
                      <Button
                        color="success"
                        type="button"
                        size="sm"
                        onClick={() => handleOnChange(row)}
                      >
                        Update
                      </Button>
                    </Col>
                  </Row>
                );
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
                    <h1>Stocks</h1>
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
                  <Col xs={12} sm={1}>
                    <Button
                      color="success"
                      type="button"
                      size="sm"
                      onClick={() => history.push("/admin/stock-import")}
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

export default Stocks;
