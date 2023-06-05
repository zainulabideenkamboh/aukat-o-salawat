import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Checkbox,
  Box,
  Paper,
  TableContainer,
  CircularProgress,
  Button,
} from "@mui/material";
import Toaster from "../../components/Toaster";

import ApiClient from "../../services/ApiClient";

const CheckboxContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  marginLeft: "20px",
});

function NamazMethod() {
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [methods, setMethods] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true); // State for tracking loading status
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

  const handleToasterOpen = (type, message) => {
    setToasterState({
      open: true,
      type,
      message,
    });
    setTimeout(handleToasterClose, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiClient.get(
          "http://aukat-o-salawat-api.ap-northeast-1.elasticbeanstalk.com/api/v1/namaz/methods"
        );
        const data = response.data;

        if (data.code === 200 && data.message === "SUCCESS") {
          setSelectedMethods([data.data.methods[0].id]);
          setMethods(data.data.methods);

          setSelectedSchools([data.data.schools[0].id]);
          setSchools(data.data.schools);
        } else {
        }

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.log("Error fetching namaz timings: ", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchData();
  }, []);

  const handleSchoolSelection = (schoolId) => {
    setSelectedSchools([schoolId]);
  };

  const handleMethodSelection = (methodId) => {
    setSelectedMethods([methodId]);
  };

  const handleSave = async () => {
    console.log(
      "selectedSchools : ",
      selectedSchools[0],
      " | selectedMethods : ",
      selectedMethods[0]
    );

    try {
      const response = await ApiClient.put(
        `http://aukat-o-salawat-api.ap-northeast-1.elasticbeanstalk.com/api/v1/users/method?method=${selectedMethods[0]}&school=${selectedSchools[0]}`
      );
      const data = response.data;
      console.log("Resp : ", response.data);

      if (data.code === 200) {
        handleToasterOpen("success", "School and Method saved successfully!");
      } else {
        handleToasterOpen(
          "error",
          "School and Method  failed. Please try again."
        );
      }
    } catch (error) {
      console.log("Error fetching namaz timings: ", error);
      handleToasterOpen(
        "error",
        "An error occurred while saving school and method. Please try again."
      );
    }
  };

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Toaster {...toasterState} />

        <Typography variant="h4">Namaz Methods</Typography>
        <Box p={2}>
          {loading ? (
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
          ) : (
            <TableContainer component={Paper}>
              {/* <Typography
                variant="h6"
                component="h2"
                sx={{ marginLeft: "20px" }}
                // gutterBottom
              >
                Schools:
              </Typography>
              {schools.map((school) => (
                <CheckboxContainer key={school.id}>
                  <Checkbox
                    checked={selectedSchools.includes(school.id)}
                    onChange={() => handleSchoolSelection(school.id)}
                  />
                  <Typography>{school.name}</Typography>
                </CheckboxContainer>
              ))} */}
              <Typography
                variant="h6"
                component="h2"
                sx={{ marginLeft: "20px" }}
                // gutterBottom
              >
                Methods:
              </Typography>

              {methods.map((method) => (
                <CheckboxContainer key={method.id}>
                  <Checkbox
                    checked={selectedMethods.includes(method.id)}
                    onChange={() => handleMethodSelection(method.id)}
                  />
                  <Typography>{method.name}</Typography>
                </CheckboxContainer>
              ))}
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  marginLeft: "20px",
                  marginBottom: "20px",
                  marginTop: "20px",
                }}
              >
                Save
              </Button>
            </TableContainer>
          )}
        </Box>
      </Grid>
    </Layout>
  );
}

export default NamazMethod;
