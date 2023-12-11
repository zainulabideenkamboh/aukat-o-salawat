import React from "react";
import Layout from "../../components/Layout";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { Container } from "@mui/system";
import raspberryPiImage from "../../assets/images/raspberryPi.jpeg";

const PurchaseDevice = () => {
  const handlePurchase = () => {
    window.location.href = "YOUR_STRIPE_PAYMENT_URL";
  };

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Typography variant="h4">Purchase Raspberry Pi</Typography>
        <Container maxWidth="sm" style={{ marginTop: "20px" }}>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Welcome to the Raspberry Pi Store
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <img
                    src={raspberryPiImage} // Replace with the actual image URL
                    alt="Raspberry Pi"
                    style={{ width: "100%", maxWidth: "600px", margin: "auto" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePurchase}
                  >
                    Buy Now
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Grid>
    </Layout>
  );
};

export default PurchaseDevice;
