import * as React from "react";
import Layout from "../../components/Layout";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

function Configuration() {
  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Typography variant="h4">Configuration</Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          ac nibh at felis elementum lacinia ac in magna. Integer lacinia, nunc
          eu bibendum interdum, purus quam fermentum lacus, sed viverra tellus
          neque a tellus. Nam ornare quam id turpis sollicitudin, ac mattis
          tellus tincidunt. Maecenas sollicitudin libero eget ipsum consectetur,
          vel aliquet justo pulvinar. Pellentesque habitant morbi tristique
          senectus et netus et malesuada fames ac turpis egestas. Donec euismod
          ex at purus blandit bibendum. Vivamus et dolor mauris. Vivamus
          tristique arcu ut magna dapibus, eu euismod tortor semper. Nam cursus
          nunc in dolor consectetur euismod. Nam id leo vel nibh pulvinar
          facilisis eu vel lacus. Donec posuere nunc eu nunc sagittis, ac
          bibendum arcu maximus. Praesent posuere mi quis nisi dictum bibendum.
        </Typography>
      </Grid>
    </Layout>
  );
}

export default Configuration;
