import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Grid, TextField, Button } from "@mui/material";

import Layout from "../../components/Layout";
import Toaster from "../../components/Toaster";
import ApiClient from "../../services/ApiClient";

const Container = styled("form")({
  padding: "32px",
  backgroundColor: "#F7F7F7",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  margin: "auto",
  maxWidth: "400px",
  width: "100%",
  position: "relative",
});

const Header = styled("h2")({
  textAlign: "center",
  marginTop: "0",
  marginBottom: "32px",
});

function Configuration() {
  const [serialNumber, setSerialNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [toasterState, setToasterState] = useState({
    open: false,
    type: "",
    message: "",
  });

  const handleToasterClose = () => {
    setToasterState({
      ...toasterState,
      open: false,
    });
  };

  const handleSerialNumberChange = (event) => {
    const value = event.target.value;
    setSerialNumber(value);
    validateSerialNumber(value);
  };

  const validateSerialNumber = (value) => {
    if (value.length !== 16) {
      setErrorMessage("Serial number must be 16 characters long.");
    } else {
      setErrorMessage("");
    }
  };

  const handleToasterOpen = (type, message) => {
    setToasterState({
      open: true,
      type,
      message,
    });
    setTimeout(handleToasterClose, 3000);
  };

  const handleUpdate = async () => {
    try {
      const response = await ApiClient.put(
        `https://salaat-app-391409.an.r.appspot.com/api/v1/users/serialnumber?serial=${serialNumber}`
      );
      const data = response.data;
      if (data.code === 200) {
        handleToasterOpen("success", "Serial number updated successfully!");
      } else {
        handleToasterOpen("error", "Serial number failed. Please try again.");
      }
    } catch (error) {
      handleToasterOpen(
        "error",
        "An error occurred while updating serial number. Please try again."
      );
    }
  };

  const isButtonDisabled = serialNumber.length !== 16;

  return (
    <Layout>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "80vh" }}
        item
        xs={12}
        sm={8}
        md={9}
      >
        <Container>
          <Header>Update Serial Number</Header>
          <Toaster {...toasterState} />

          <TextField
            label="Serial Number"
            value={serialNumber}
            onChange={handleSerialNumberChange}
            error={errorMessage !== ""}
            helperText={errorMessage}
            fullWidth
            margin="normal" // Add margin between input fields
          />
          <Button
            variant="contained"
            onClick={handleUpdate}
            fullWidth
            style={{ marginTop: "16px" }} // Add margin above the button
            disabled={isButtonDisabled} // Disable the button if serialNumber is not 16 characters long
          >
            Update
          </Button>
        </Container>
      </Grid>
    </Layout>
  );
}

export default Configuration;
