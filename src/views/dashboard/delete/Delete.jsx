import React from "react";
import { NotificationManager } from "react-notifications";
import ReactDatetime from "react-datetime";
import {
  Card,
  CardBody,
  Container,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Button,
  Input,
} from "reactstrap";
import { call } from "services/api";

const Delete = () => {
  const [shop, setShop] = React.useState("");
  const [shops, setShops] = React.useState([]);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const mountedRef = React.useRef(true);

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
    getShops();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleDeleteByDate = async () => {
    if (shop === "" || startDate === "" || endDate === "") {
      NotificationManager.warning("Please fill data to delete!");
    } else {
      const stepOne = window.confirm("Are you sure to delete your data?");

      if (stepOne) {
        const stepTwo = window.confirm("Really?");

        if (stepTwo) {
          const response = await call(
            "get",
            `date-delete-sales/${shop}?start_date=${startDate}&end_date=${endDate}`
          );

          console.log(response);

          if (response.status === "success") {
            NotificationManager.success(response.data.message);
          } else {
            NotificationManager.error("Failed! Please Try Again.");
          }
        }
      }
    }
  };

  const handleDelete = async () => {
    const stepOne = window.confirm("Are you sure to delete your data?");

    if (stepOne) {
      const stepTwo = window.confirm("Really?");

      if (stepTwo) {
        const response = await call("get", "deletes");

        if (response.status === "success") {
          NotificationManager.success(response.data.message);
        } else {
          NotificationManager.error("Failed! Please Try Again.");
        }
      }
    }
  };

  return (
    <Container className="mt-6" fluid>
      <Card>
        <CardBody>
          <Row>
            <Col xs={12} sm={3}>
              <Input
                id="shops"
                type="select"
                className="form-control-sm"
                style={{
                  height: "45px",
                }}
                onChange={(event) => setShop(event.target.value)}
              >
                <option value="">None</option>
                {shops.map((data) => (
                  <option value={data.id} key={data.id}>
                    {data.name}
                  </option>
                ))}
              </Input>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "Start Date",
                    }}
                    onChange={(event) =>
                      setStartDate(event.format("YYYY-MM-DD"))
                    }
                    timeFormat={false}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "End Date",
                    }}
                    onChange={(event) => setEndDate(event.format("YYYY-MM-DD"))}
                    timeFormat={false}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <Button color="danger" type="button" onClick={handleDeleteByDate}>
                Delete by date
              </Button>
            </Col>
          </Row>
          <div className="text-center">
            <h1>Clear All Data</h1>
            <Button
              className="my-4"
              color="danger"
              type="button"
              size="sm"
              onClick={handleDelete}
            >
              Format Data
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Delete;
