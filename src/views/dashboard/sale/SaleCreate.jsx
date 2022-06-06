import React, { useEffect, useState } from "react";
import useQuery from "hooks/useQuery";
// reactstrap components
import {
  FormGroup,
  Form,
  Input,
  Container,
  Button,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Alert
} from "reactstrap";
import { NotificationManager } from "react-notifications";
import { call } from "services/api";
import { useHistory } from "react-router";
import Select from "react-select";
import styles from "./SaleCreate.module.css";

const SaleCreate = ({ match }) => {
  const [filterStocks, setFilterStocks] = useState([]);
  const [stock, setStock] = useState(null);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(0);
  const [customer, setCustomer] = useState("-");
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [manual, setManual] = useState(false);
  const [dataBarCode, setDataBarCode] = useState(null);

  const { shopid } = match.params;
  const [barcodeInputValue, updateBarcodeInputValue] = useState("");

  const history = useHistory();

  const {
    response: categories,
    error: categoryError,
    loading: categoryLoading
  } = useQuery("get", "categories");

  const {
    response: stocks,
    error: stockError,
    loading: stockLoading
  } = useQuery("get", `stocks/${shopid}`);

  const {
    response: customers,
    error: customerError,
    loading: customerLoading
  } = useQuery("get", `customers/${shopid}`);

  const {
    response: shop,
    error: shopError,
    loading: shopLoading
  } = useQuery("get", `shops/${shopid}`);

  useEffect(() => {
    setFilterStocks(stocks);
  }, [stocks]);

  const handleCategory = (option) => {
    if (option === null) {
      setFilterStocks(stocks);
    } else {
      const filterStocksByShopID = stocks.filter(
        (stock) => stock.item.category.id === option.value
      );
      setFilterStocks(filterStocksByShopID);
    }
  };

  const handleStock = (option) => {
    if (option === null) {
      setPrice(0);
      setStock(null);
    } else if (dataBarCode) {
      // setStock(dataBarCode);
      // setPrice(Number(dataBarCode.item.sale_price));
    } else {
      const findStock = stocks.find((stock) => stock.id === option.value);
      // console.log("find", findStock);
      setStock(findStock);
      setPrice(Number(findStock.item.sale_price));
    }
  };

  const handleSubtotal = (enterQuantity) => {
    setQuantity(enterQuantity);
    setSubtotal(Number(enterQuantity) * Number(price));
  };

  // for barcode
  const onChangeBarcode = (event) => {
    updateBarcodeInputValue(event.target.value);
  };

  // console.log("stocksssss", stock);
  // console.log("price", price);

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      updateBarcodeInputValue(e.target.value);
      const item = filterStocks.find((i) => i?.item?.code === e.target.value);
      if (item) {
        setDataBarCode(item);
        setStock(item);
        setPrice(Number(item.item.sale_price));
      }
    }
  };

  //end for barcode
  // console.log("dataBarCode", dataBarCode);
  // console.log("filter Stocks", filterStocks);

  const handleAddRow = () => {
    const index = items.findIndex((item) => item.stock_id === stock.id);
    if (index === -1) {
      if (stock.quantity > 0) {
        if (stock !== null && Number(quantity) !== 0) {
          if (stock.quantity >= Number(quantity)) {
            const item = {
              stock,
              stock_id: stock.id,
              price: Number(price),
              quantity: Number(quantity),
              subtotal
            };

            setItems((prev) => [...prev, item]);
            setStock(null);
            setPrice(0);
            setQuantity(0);
            setSubtotal(0);
          } else {
            NotificationManager.error("Stock is less than quantity!");
          }
        } else {
          NotificationManager.error("Please insert item to sell!");
        }
      } else {
        NotificationManager.error("Stock is zero!");
      }
    } else {
      NotificationManager.error("Item has been already inserted!");
    }
  };

  const handleDelete = (stock_id) => {
    const filterItems = items.filter((item) => item.stock_id !== stock_id);
    setItems(filterItems);
  };

  const handleCustomer = (customer) => {
    // console.log("c", customer);
    if (customer === "") {
      setCustomer("-");
    } else {
      // setCustomer(customer);
      if (customer) {
        const result = customers.find((c) => c.name === customer);
        setCustomerData(result);
      }
    }
  };

  // console.log(customers);
  // console.log("result", customerData);

  const handleSaleBarcode = () => {
    setManual(!manual);
  };

  // const onChange = (data) => {
  //   console.log(data);
  //   // if (value === undefined) {
  //   //   setBuyMerchant(null);
  //   // } else {
  //   //   const filterBuyMerchant = merchant.merchants.find(
  //   //     (mer) => mer.id === value
  //   //   );
  //   //   setBuyMerchant(filterBuyMerchant);
  //   // }
  // };

  // console.log("customer", customerData);

  if (categoryLoading || stockLoading || customerLoading || shopLoading)
    return (
      <Alert color="secondary">
        <strong>Loading! </strong> Please wait a second!
      </Alert>
    );

  if (categoryError)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {categoryError.message}
      </Alert>
    );

  if (stockError)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {stockError.message}
      </Alert>
    );

  if (customerError)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {customerError.message}
      </Alert>
    );
  if (shopError)
    return (
      <Alert color="danger">
        <strong>Error! </strong>
        {shopError.message}
      </Alert>
    );

  const purchaseTotal =
    items.length > 0
      ? items
          .map((item) => item.stock.item.buy_price * item.quantity)
          .reduce((a, b) => a + b)
      : 0;

  const total =
    items.length > 0
      ? items.map((item) => item.subtotal).reduce((a, b) => a + b)
      : 0;

  const discountAmount = total * (Number(discount) / 100);

  const handleSave = async () => {
    if (items.length > 0) {
      const savedData = {
        customer_name: customerData ? customerData.name : "-",
        customer_id: customerData?.id ? customerData?.id : 0,
        purchase_total: purchaseTotal,
        sale_record_total: total,
        extra_charges: 0,
        whole_total: total,
        paid: Number(paid),
        discount: Number(discount),
        shop_id: Number(shopid),
        single_sales: items
      };

      // console.log(savedData);

      setLoading((prev) => !prev);
      try {
        const response = await call("post", "sales", savedData);
        if (response.status === "success") {
          handleClear();
          history.push(`/admin/print-sale/${response.data.id}`);
        }
      } catch (error) {
        if (error.response.status === 401) {
          NotificationManager.error(error.response.data.data.message);
        }
        if (error.response.status === 400) {
          NotificationManager.error(error.response.data.message);
        }
      }
      setLoading((prev) => !prev);
    } else {
      NotificationManager.error("Please insert item to sell!");
    }
  };

  const handleClear = () => {
    setItems([]);
    setCustomer("-");
    setPaid(0);
    setDiscount(0);
  };

  return (
    <Container className="mt-3" fluid>
      <Card>
        <CardHeader>
          <Row>
            <Col xs={12} sm={4}>
              <h3>Create Sale</h3>
            </Col>
            <Col xs={12} sm={4}>
              <h3>{shop.name}</h3>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Button style={{ marginBottom: "20px" }} onClick={handleSaleBarcode}>
            {manual ? "Sale With BarCode" : "Not Sale BarCode"}
          </Button>

          {manual ? (
            <Form id="manual">
              <Row>
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label htmlFor="categories" className="mr-1 mt-1">
                        Categories:
                      </label>
                      <Select
                        id="categories"
                        placeholder="Select Category"
                        className={styles["css-b62m3t-container"]}
                        options={categories.map((data) => ({
                          label: data.name,
                          value: data.id
                        }))}
                        isClearable={true}
                        isSearchable={true}
                        onChange={(option) => handleCategory(option)}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label htmlFor="items" className="mr-1 mt-1">
                        Items:
                      </label>

                      <Select
                        id="items"
                        placeholder="Select Item"
                        className={styles["css-b62m3t-container"]}
                        options={filterStocks.map((data) => ({
                          label: `${data.item.name}(${data.quantity})`,
                          value: data.id
                        }))}
                        isClearable={true}
                        isSearchable={true}
                        onChange={(option) => handleStock(option)}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label className="mr-1 mt-1" htmlFor="price">
                        Price:
                      </label>
                      <Input
                        id="price"
                        placeholder="Enter price"
                        type="number"
                        className="form-control-sm"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label className="mr-1 mt-1" htmlFor="quantity">
                        Quantity:
                      </label>
                      <Input
                        id="quantity"
                        placeholder="Enter quantity"
                        type="number"
                        className="form-control-sm"
                        value={quantity}
                        onChange={(event) => handleSubtotal(event.target.value)}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label className="mr-1 mt-1" htmlFor="subtotal">
                        Subtotal:
                      </label>
                      <Input
                        id="subtotal"
                        placeholder="Enter subtotal"
                        type="number"
                        className="form-control-sm"
                        value={subtotal}
                        onChange={(event) => setSubtotal(event.target.value)}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={4}>
                  <Button
                    color="success"
                    type="button"
                    size="sm"
                    onClick={handleAddRow}
                  >
                    Add Row
                  </Button>
                </Col>
              </Row>
            </Form>
          ) : (
            <Form id="barcode">
              <Row>
                {/* <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label htmlFor="categories" className="mr-1 mt-1">
                        Categories:
                      </label>
                      <Select
                        id="categories"
                        placeholder="Select Category"
                        className={styles["css-b62m3t-container"]}
                        options={categories.map((data) => ({
                          label: data.name,
                          value: data.id
                        }))}
                        isClearable={true}
                        isSearchable={true}
                        onChange={(option) => handleCategory(option)}
                      />
                    </div>
                  </FormGroup>
                </Col> */}
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label htmlFor="items" className="mr-1 mt-1">
                        Items Name:
                      </label>
                      <label htmlFor="items" className="mr-1 mt-1">
                        {dataBarCode?.item?.name
                          ? dataBarCode?.item?.name
                          : "-"}
                      </label>
                      {/* <Input
                        id="items"
                        type="text"
                        placeholder="Enter item's name"
                        className="form-control-sm"
                        value={dataBarCode?.item?.name}
                        onChange={(event) => setCustomer(event.target.value)}
                      /> */}

                      {/* <Select
                        id="items"
                        placeholder="Select Item"
                        className={styles["css-b62m3t-container"]}
                        options={filterStocks.map((data) => ({
                          label: `${data.item.name}(${data.quantity})`,
                          value: data.id
                        }))}
                        isClearable={true}
                        isSearchable={true}
                        onChange={(option) => handleStock(option)}
                      /> */}
                    </div>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label className="mr-1 mt-1" htmlFor="price">
                        Price:
                      </label>

                      <Input
                        id="price"
                        placeholder="Enter price"
                        type="number"
                        className="form-control-sm"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label className="mr-1 mt-1" htmlFor="quantity">
                        Quantity:
                      </label>
                      <Input
                        id="quantity"
                        placeholder="Enter quantity"
                        type="number"
                        className="form-control-sm"
                        value={quantity}
                        onChange={(event) => handleSubtotal(event.target.value)}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label className="mr-1 mt-1" htmlFor="subtotal">
                        Subtotal:
                      </label>
                      <Input
                        id="subtotal"
                        placeholder="Enter subtotal"
                        type="number"
                        className="form-control-sm"
                        value={subtotal}
                        onChange={(event) => setSubtotal(event.target.value)}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={4}>
                  <Button
                    color="success"
                    type="button"
                    size="sm"
                    onClick={handleAddRow}
                  >
                    Add Row
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4}>
                  <FormGroup>
                    <div className="custom-control-inline mt-1">
                      <label className="mr-1 mt-1" htmlFor="quantity">
                        Search:
                      </label>
                      <Input
                        autoFocus={true}
                        placeholder="Start Scanning.."
                        type="text"
                        className="form-control-sm SearchInput"
                        id="SearchbyScanning"
                        value={barcodeInputValue}
                        onChange={onChangeBarcode}
                        onKeyDown={onKeyDown}
                        // value={quantity}
                        // onChange={(event) => handleSubtotal(event.target.value)}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
        </CardBody>

        <Container fluid>
          <Row className="mb-3">
            <Col xs={12} sm={4}>
              <h2>Items - {items.length}</h2>
            </Col>
            <Col xs={12} sm={4}>
              <div className="custom-control-inline mt-1">
                <label htmlFor="customers" className="mr-1 mt-1">
                  Customers:
                </label>
                <Input
                  id="customers"
                  type="select"
                  className="form-control-sm"
                  onChange={(event) => handleCustomer(event.target.value)}
                >
                  <option value="1">Select Customer</option>
                  {customers.map((data) => (
                    <option value={data.name} key={data.id}>
                      {data.name}
                    </option>
                  ))}
                </Input>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              {/* <div className="custom-control-inline mt-1">
                <Input
                  id="customer"
                  placeholder="Enter customer name"
                  className="form-control-sm"
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                />
              </div> */}
              <div className="custom-control-inline mt-1">
                <label htmlFor="categories" className="mr-1 mt-1">
                  {customerData != null
                    ? customerData.name + "--" + customerData.phone_no
                    : customer}
                </label>
              </div>
            </Col>
          </Row>
        </Container>
        <table className="mt-3 table">
          <thead>
            <tr>
              <th>#</th>
              <th className="col-4">Item Name</th>
              <th className="col-2 text-right">Price</th>
              <th className="col-2 text-right">Quantity</th>
              <th className="col-2 text-right">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="col-4">{item.stock.item.name}</td>
                  <td className="col-2 text-right">{item.price}</td>
                  <td className="col-2 text-right">{item.quantity}</td>
                  <td className="col-2 text-right">{item.subtotal}</td>
                  <td>
                    <Button
                      color="danger"
                      type="button"
                      size="sm"
                      onClick={() => handleDelete(item.stock_id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="text-right">
                Total
              </td>
              <td colSpan="2"></td>
              <td className="text-right">{total}</td>
            </tr>
            <tr>
              <td colSpan="2" className="text-right">
                Discount
              </td>
              <td colSpan="2">
                <Input
                  id="discount"
                  placeholder="Enter discount"
                  type="number"
                  className="form-control-sm"
                  value={discount}
                  onChange={(event) => setDiscount(event.target.value)}
                />
              </td>
              <td className="text-right">{discountAmount}</td>
            </tr>
            <tr>
              <td colSpan="2" className="text-right">
                Grand Total
              </td>
              <td colSpan="2"></td>
              <td className="text-right">{total - discountAmount}</td>
            </tr>
            <tr>
              <td colSpan="2" className="text-right">
                Paid
              </td>
              <td colSpan="2">
                <Input
                  id="paid"
                  placeholder="Enter paid"
                  type="number"
                  className="form-control-sm"
                  value={paid}
                  onChange={(event) => setPaid(event.target.value)}
                />
              </td>
              <td className="text-right">{paid}</td>
            </tr>
            <tr>
              <td colSpan="2" className="text-right">
                Credit
              </td>
              <td colSpan="2"></td>
              <td className="text-right">
                {total - discountAmount - Number(paid)}
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="text-right">
                Customer Name
              </td>
              <td colSpan="2"></td>
              <td className="text-right">{customer}</td>
            </tr>
          </tfoot>
        </table>
        <Row className="m-3">
          <Col xs={11} sm={11} className="text-right">
            <Button color="success" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button
              disabled={loading}
              color="success"
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
          </Col>
          <Col xs={1} sm={1}></Col>
        </Row>
      </Card>
    </Container>
  );
};
export default SaleCreate;
