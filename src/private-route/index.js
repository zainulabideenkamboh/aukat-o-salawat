import { Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";

function PrivateRoute({ path, element: Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Perform token validation here
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setTokenChecked(true);
    };

    checkAuthentication();
  }, []);

  if (!tokenChecked) {
    // Render a loading state while token retrieval is in progress
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Element />;
  } else {
    return <Navigate to="/sign-in" replace />;
  }
}

export default PrivateRoute;
