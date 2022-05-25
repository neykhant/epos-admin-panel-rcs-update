import React from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// reactstrap components
import { Container, Row, Col, Card, Input } from "reactstrap";
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

const MoreSales = ({ match }) => {
  const componentRef = React.useRef(null);
  const [moreSales, setMoreSales] = React.useState([]);
  const [filterMoreSales, setFilterMoreSales] = React.useState([]);
  const [shops, setShops] = React.useState([]);
  const mountedRef = React.useRef(true);

  const getMoreSales = React.useCallback(async () => {
    if (!mountedRef.current) return null;
    try {
      const { shopid } = match.params;
      const response = await call("get", `more-sales/${shopid}`);
      const result = response.data.map((data, index) => {
        return {
          ...data,
          key: index + 1,
        };
      });

      setMoreSales(result);
      setFilterMoreSales(result);
    } catch (error) {
      console.log(error.response);
    }
  }, [match.params]);

  const getShops = async () => {
    if (!mountedRef.current) return null;
    try {
      const response = await call("get", "shops");
      const result = response.data;

      setShops(result);
    } catch (error) {
      console.log(error.response);
    }
  };

  React.useEffect(() => {
    getMoreSales();
    getShops();

    return () => {
      mountedRef.current = false;
    };
  }, [getMoreSales]);

  const handleSelectShop = (shopID) => {
    if (shopID === "all") {
      setFilterMoreSales(moreSales);
    } else {
      const filterMoreSalesByShopID = moreSales.filter(
        (moreSale) => moreSale.stock.shop_id === shopID
      );
      setFilterMoreSales(filterMoreSalesByShopID);
    }
  };

  return (
    <Container className="mt-6" fluid>
      <Card>
        <ToolkitProvider
          data={filterMoreSales}
          keyField="stock.id"
          exportCSV
          columns={[
            {
              dataField: "key",
              text: "#",
              sort: true,
            },
            {
              dataField: "stock.id",
              text: "ID",
              sort: true,
            },
            {
              dataField: "stock.item.name",
              text: "Name",
              sort: true,
            },
            {
              dataField: "stock.item.code",
              text: "Code",
              sort: true,
            },
            {
              dataField: "total",
              text: "Total",
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
                    <h1>More Sales</h1>
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

export default MoreSales;
