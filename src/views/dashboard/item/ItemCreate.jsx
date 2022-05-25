import React from "react";
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
} from "reactstrap";

const ItemCreate = () => {
  return (
    <Container className="mt-3" fluid>
      <Card>
        <CardHeader>
            Create New Item
        </CardHeader>
        <CardBody>
          <Form>
            <FormGroup>
              <label className="form-control-label" htmlFor="code">
                Code
              </label>
              <Input id="code" placeholder="Enter Item Code" type="text" />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label" htmlFor="name">
                Name
              </label>
              <Input id="name" placeholder="Enter Item Name" type="text" />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label" htmlFor="category">
                Category
              </label>
              <Input
                id="category"
                placeholder="Enter Item Category"
                type="text"
              />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label" htmlFor="buy_price">
                Buy Price
              </label>
              <Input
                id="buy_price"
                placeholder="Enter Buy Price"
                type="number"
              />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label" htmlFor="sale_price">
                Sale Price
              </label>
              <Input
                id="sale_price"
                placeholder="Enter Sale Price"
                type="number"
              />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label" htmlFor="left_item">
                Left Item
              </label>
              <Input
                id="left_item"
                placeholder="Enter Left Item"
                type="number"
              />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label" htmlFor="shops">
                Shops
              </label>
              <Input id="shops" type="select">
                <option value="">Select Shop</option>
              </Input>
            </FormGroup>
            <div className="text-center">
              <Button className="my-4" color="success" type="button">
                Creating New Item
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ItemCreate;
