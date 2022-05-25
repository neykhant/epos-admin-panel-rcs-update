import React from "react";
import { Button } from "reactstrap";

const ExportButton = (props) => {
  const handleClick = () => {
    props.onExport();
  };
  return (
    <Button color="success" type="button" size="sm" onClick={handleClick}>
      Export
    </Button>
  );
};

export default ExportButton;
