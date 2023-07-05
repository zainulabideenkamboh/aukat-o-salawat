import React, { useState } from "react";
import Layout from "../../components/Layout";
import {
  Typography,
  Checkbox,
  Box,
  Paper,
  TableContainer,
  CircularProgress,
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Toaster from "../../components/Toaster";
import ApiClient from "../../services/ApiClient";

import axios from "axios";

function Location() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`,
        {
          headers: {
            "X-Api-Key": "mNjHLBVa4hYepMpj3llNcg==K9wx2Az4iyHygr3Q",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data && Array.isArray(data)) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results: ", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
  };

  const handleSave = async () => {
    console.log("Selected Item:", selectedItem);
    try {
      const response = await ApiClient.put(
        `https://salaat-app-391409.an.r.appspot.com/api/v1/users/location?lat=${selectedItem.latitude}&lng=${selectedItem.longitude}`
      );
      const data = response.data;
      console.log("Response is : ", response.data);

      if (data.code === 200) {
        handleToasterOpen("success", "Location saved successfully!");
      } else {
        handleToasterOpen("error", "Location failed. Please try again.");
      }
    } catch (error) {
      console.log("Error fetching namaz timings: ", error);
      handleToasterOpen(
        "error",
        "An error occurred while saving location. Please try again."
      );
    }
  };

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Typography variant="h4">Select Location</Typography>
        <Toaster {...toasterState} />

        <Box p={2} display="flex" alignItems="center">
          <TextField
            label="Country"
            value={country}
            onChange={handleCountryChange}
            sx={{ marginRight: "10px" }}
          />
          <TextField
            label="City"
            value={city}
            onChange={handleCityChange}
            sx={{ marginRight: "10px" }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>
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
          ) : searchResults.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Latitude</TableCell>
                    <TableCell>Longitude</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>State</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItem === item}
                          onChange={(event) =>
                            handleCheckboxChange(event, item)
                          }
                        />
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.latitude}</TableCell>
                      <TableCell>{item.longitude}</TableCell>
                      <TableCell>{item.country}</TableCell>
                      <TableCell>{item.state}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!loading && (
                <Box p={2} textAlign="left">
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    // disabled={!selectedItem}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </TableContainer>
          ) : (
            <Typography variant="body1">No results found.</Typography>
          )}
        </Box>
      </Grid>
    </Layout>
  );
}

export default Location;
