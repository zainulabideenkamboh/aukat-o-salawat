import React from "react";
import Layout from "../../components/Layout";
import { Grid } from "@mui/material";

import NamazTimings from "../../components/NamazTimings";
import AudioSchedule from "../../components/AudioSchedule";

function AudioTiming() {
  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9} style={{ marginBottom: "20px" }}>
        <NamazTimings />
        <AudioSchedule />
      </Grid>
    </Layout>
  );
}

export default AudioTiming;
