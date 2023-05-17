import React from "react";
import { Snackbar, Alert } from "@mui/material";

const Toaster = ({ type, message, open }) => {
  return (
    <Snackbar open={open} autoHideDuration={3000}>
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  );
};

export default Toaster;
