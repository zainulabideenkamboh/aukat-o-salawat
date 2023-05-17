import React, { useState } from "react";
import { Grid } from "@mui/material";
import Header from "../Header";
import Sidebar from "../Sidebar";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Grid
      container
      style={{ height: "100vh" }}
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12}>
        <Header handleSidebarToggle={handleSidebarToggle} isOpen={isOpen} />
      </Grid>
      <Grid item xs={12} sm={4} md={3}>
        <Sidebar isOpen={isOpen} />
      </Grid>
      <Grid item xs={12} sm={8} md={9} sx={{ marginTop: "16px" }}>
        {children}
      </Grid>
    </Grid>
  );
};

export default Layout;
