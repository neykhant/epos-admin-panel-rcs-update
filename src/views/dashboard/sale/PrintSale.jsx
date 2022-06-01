import React from "react";
import useQuery from "hooks/useQuery";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Alert, Button, Col, Container, Row } from "reactstrap";
import { getDate } from "utils/convertToDate";
// import logo from "assets/img/brand/clothing.jpg";
import logo from "assets/img/brand/h5.jpg";

const PrintSale = ({ match }) => {
  const componentRef = useRef();
  const { shopid } = match.params;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const { response: sale, error, loading } = useQuery("get", `sale/${shopid}`);

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

  // console.log(sale);

  return (
    <Container fluid>
      <Button className="mt-3" size="sm" color="info" onClick={handlePrint}>
        Print Voucher
      </Button>
      <div style={{ margin: "40px" }} ref={componentRef}>
        <Row
          style={{
            justifyContent: "center",
            marginBottom: "15px"
          }}
        >
          <Col className="col-1">
            <img
              src={logo}
              width={200}
              height={200}
              alt="logo"
              style={
                {
                  // borderRadius: "80px",
                  // textAlign: "center",
                  // alignItems: "center"
                }
              }
            />
          </Col>
          <Col className="col-1"></Col>
          <Col className="col-10">
            <p
              // className="text-center"
              style={{
                fontWeight: "bold",
                fontSize: "30px",
                marginBottom: "1px",
                marginLeft: "50px"
              }}
            >
              ဦးဆန်းဝင်း + ‌ဒေါ်‌လှလှဌေး
            </p>
            <p
              // className="text-center"
              style={{
                fontWeight: "bold",
                fontSize: "28px",
                marginBottom: "1px",
                marginLeft: "50px"
              }}
            >
              {sale.shop.name}
            </p>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "26px",
                marginBottom: "1px",
                marginLeft: "50px"
              }}
            >
              {sale.shop.address}
            </p>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "22px",
                marginBottom: "1px",
                marginLeft: "50px"
              }}
            >
              {sale.shop.phone_no_one}, {sale.shop.phone_no_two}
            </p>
          </Col>
          {/* <Col className="col-8">
            <p style={{ fontWeight: "bold", fontSize: "36px" }}>
              {sale.shop.name}
            </p>
          </Col> */}
          {/* <Col className="col-2">
            <Row>
              <Col style={{ fontSize: "20px" }} className="text-right">
                ဘောင်ချာနံပါတ်:{" "}
              </Col>
              <Col style={{ fontSize: "20px" }}>{sale.id}</Col>
            </Row>
            <Row>
              <Col style={{ fontSize: "20px" }} className="text-right">
                ရက်စွဲ:{" "}
              </Col>
              <Col style={{ fontSize: "20px" }}>{getDate(sale.created_at)}</Col>
            </Row>
            <Row>
              <Col style={{ fontSize: "20px" }} className="text-right">
                အမည်:{" "}
              </Col>
              <Col style={{ fontSize: "20px" }}>{sale.customer_name}</Col>
            </Row>
          </Col> */}
        </Row>
        <Row style={{ marginBottom: "-10px" }}>
          <Col className="col-1">
            <span
              style={{
                fontSize: "20px"
                // marginBottom: "5px"
              }}
            >
              အမည်:
            </span>
          </Col>
          <Col className="col-2">
            <p style={{ fontSize: "20px" }}>{sale.customer_name}</p>
          </Col>
          <Col className="col-4"></Col>
          <Col className="col-2">
            <p style={{ fontSize: "20px" }}>ဘောင်ချာနံပါတ်:</p>
          </Col>
          <Col className="col-3">
            <p style={{ fontSize: "20px" }}>{sale.id}</p>
          </Col>
        </Row>
        <Row>
          <Col className="col-1">
            <p style={{ fontSize: "20px" }}>ဖုန်း</p>
          </Col>
          <Col className="col-2">
            <p style={{ fontSize: "20px" }}>{sale.pay_way}</p>
          </Col>
          <Col className="col-4"></Col>
          <Col className="col-2">
            <p style={{ fontSize: "20px" }}>ရက်စွဲး</p>
          </Col>
          <Col className="col-3">
            <p style={{ fontSize: "20px" }}>{getDate(sale.created_at)}</p>
          </Col>
        </Row>

        <table
          className="mt-3 table table-bordered"
          // style={{
          //   borderWidth: "2px",
          //   borderColor: "black",
          //   borderStyle: "solid"
          // }}
        >
          <thead
            style={{
              // borderWidth: "2px",
              // borderColor: "black",
              // borderStyle: "solid"
              borderTop: "2px solid black",
              borderBottom: "2px solid black"
            }}
          >
            <tr
            // style={{
            //   borderWidth: "2px",
            //   borderColor: "black",
            //   borderStyle: "solid"
            // }}
            >
              <th
                style={{
                  fontSize: "20px",
                  // borderTop: "2px solid black",
                  // borderBottom: "2px solid black"
                  // borderLeft: "2px solid black",
                  // borderRight: "2px solid black"
                  // borderTop: "1.2px solid black",
                  borderBottom: "2px solid black"
                }}
              >
                စဥ်
              </th>
              <th
                style={{
                  fontSize: "20px",
                  // borderWidth: "2px",
                  // borderColor: "black",
                  // borderStyle: "solid",
                  // borderCollapse: "separate"
                  // borderTop: "2px solid black",
                  // borderBottom: "2px solid black"
                  // borderLeft: "2px solid black",
                  // borderRight: "2px solid black"
                  borderBottom: "2px solid black"
                }}
                className="col-4"
              >
                {/* ပစ္စည်းအမည် */}
                အမျိုးအမည်
              </th>
              <th
                style={{
                  fontSize: "20px"
                  // borderWidth: "2px",
                  // borderColor: "black",
                  // borderStyle: "solid",
                  // borderCollapse: "collapse"
                  // borderTop: "2px solid black",
                  // borderBottom: "2px solid black"
                }}
                className="col-2 text-right"
              >
                အရေအတွက်
              </th>
              <th
                style={{
                  fontSize: "20px"
                  // borderWidth: "2px",
                  // borderColor: "black",
                  // borderStyle: "solid"
                  // borderTop: "2px solid black",
                  // borderBottom: "2px solid black"
                }}
                className="col-2 text-right"
              >
                ဈေးနှုန်း
              </th>
              <th
                style={{
                  fontSize: "20px"
                  // borderWidth: "2px",
                  // borderColor: "black",
                  // borderStyle: "solid"
                  // borderTop: "2px solid black",
                  // borderBottom: "2px solid black"
                }}
                className="col-2 text-right"
              >
                စုစုပေါင်း
              </th>
            </tr>
          </thead>
          <tbody
            style={{
              // borderWidth: "2px",
              // borderColor: "black",
              // borderStyle: "solid"
              borderTop: "2px solid black",
              borderBottom: "2px solid black"
            }}
          >
            {sale?.single_sales?.map((sale, index) => {
              return (
                <tr
                  key={index}
                  style={{
                    fontSize: "20px"
                    // borderWidth: "2px",
                    // borderColor: "black",
                    // borderStyle: "solid"
                  }}
                >
                  <td
                    style={{
                      fontSize: "20px"
                      // borderWidth: "2px",
                      // borderColor: "black",
                      // borderStyle: "solid"
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      fontSize: "20px"
                      // borderWidth: "2px",
                      // borderColor: "black",
                      // borderStyle: "solid"
                    }}
                    className="col-4"
                  >
                    {sale.stock.item.name}
                  </td>
                  <td
                    style={{
                      fontSize: "20px"
                      // borderWidth: "2px",
                      // borderColor: "black",
                      // borderStyle: "solid"
                    }}
                    className="col-2 text-right"
                  >
                    {sale.quantity}
                  </td>
                  <td
                    style={{
                      fontSize: "20px"
                      // borderWidth: "2px",
                      // borderColor: "black",
                      // borderStyle: "solid"
                    }}
                    className="col-2 text-right"
                  >
                    {sale.price}
                  </td>
                  <td
                    style={{
                      fontSize: "20px"
                      // borderWidth: "2px",
                      // borderColor: "black",
                      // borderStyle: "solid"
                    }}
                    className="col-2 text-right"
                  >
                    {sale.subtotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td
                style={{ fontSize: "20px" }}
                colSpan="4"
                className="text-right"
              >
                စုစုပေါင်း
              </td>
              <td
                style={{
                  fontSize: "20px"
                  // borderWidth: "2px",
                  // borderColor: "black",
                  // borderStyle: "solid",
                  // borderCollapse: "separate"
                }}
                className="text-right"
              >
                {sale.whole_total}
              </td>
            </tr>
            <tr>
              <td
                style={{ fontSize: "20px" }}
                colSpan="4"
                className="text-right"
              >
                လျော့ဈေး ({sale.discount}) %
              </td>
              <td
                style={{
                  fontSize: "20px"
                  // borderWidth: "2px",
                  // borderColor: "black",
                  // borderStyle: "solid",
                  // borderCollapse: "separate"
                }}
                className="text-right"
              >
                {sale.whole_total * (sale.discount / 100)}
              </td>
            </tr>
            <tr>
              <td
                style={{ fontSize: "20px" }}
                colSpan="4"
                className="text-right"
              >
                ပေးချေရမည့်စုစုပေါင်း
              </td>
              <td
                style={{
                  fontSize: "20px"
                  // borderWidth: "2px",
                  // borderColor: "black",
                  // borderStyle: "solid",
                  // borderCollapse: "separate"
                }}
                className="text-right"
              >
                {sale.final_total}
              </td>
            </tr>
            <tr>
              <td
                style={{ fontSize: "20px" }}
                colSpan="4"
                className="text-right"
              >
                ပေးပြီးငွေ
              </td>
              <td
                style={{
                  fontSize: "20px"
                  // borderWidth: "2px",
                  // borderColor: "black",
                  // borderStyle: "solid",
                  // borderCollapse: "separate"
                }}
                className="text-right"
              >
                {sale.paid}
              </td>
            </tr>
            <tr>
              <td
                style={{ fontSize: "20px" }}
                colSpan="4"
                className="text-right"
              >
                ပေးရန်ကျန်ငွေ
              </td>
              <td
                style={{
                  fontSize: "20px"
                  // borderWidth: "2px",
                  // borderColor: "black",
                  // borderStyle: "solid",
                  // borderCollapse: "separate"
                }}
                className="text-right"
              >
                {sale.credit}
              </td>
            </tr>
          </tfoot>
        </table>

        <div
          style={{
            position: "absolute",
            bottom: 25,
            textAlign: "center",
            width: "90%"
          }}
        >
          <p style={{ fontSize: "20px" }}>
            ဝယ်ယူအားပေးမှုအတွက် ကျေးဇူးတင်ပါသည်။
          </p>
        </div>
      </div>
    </Container>
  );
};

export default PrintSale;
