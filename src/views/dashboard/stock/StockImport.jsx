import React from "react";
import { NotificationManager } from "react-notifications";
// reactstrap components
import {
  Container,
  Card,
  Form,
  FormGroup,
  Button,
  Input,
  CardBody,
} from "reactstrap";
import { call } from "services/api";

const StockImport = () => {
  const [file, setFile] = React.useState(null);

  const handleImport = async () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("file", file);

    // Request made to the backend api
    // Send formData object
    const response = await call("post", "stocks-import", formData);

    if (response.status === "success") {
      NotificationManager.success(response.data.message);
    } else {
      NotificationManager.error("Failed! Please Try Again.");
    }
  };

  return (
    <Container className="mt-6" fluid>
      <Card>
        <CardBody>
          <Form encType="multipart/form-data">
            <FormGroup>
              <label className="form-control-label" htmlFor="file">
                Excel File
              </label>
              <Input
                id="file"
                placeholder="Choose Excel File"
                type="file"
                name="file"
                onChange={(event) => setFile(event.target.files[0])}
              />
            </FormGroup>
            <div className="text-center">
              <Button
                className="my-4"
                color="success"
                type="button"
                size="sm"
                onClick={handleImport}
              >
                Import
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default StockImport;
