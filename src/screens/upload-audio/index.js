import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import Layout from "../../components/Layout";
import ApiClient from "../../services/ApiClient";
import Toaster from "../../components/Toaster";
import axios from "axios";

function UploadAudio() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [audioName, setAudioName] = useState("");
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

  const handleAudioNameChange = (event) => {
    setAudioName(event.target.value);
  };

  const handleToasterOpen = (type, message) => {
    setToasterState({
      open: true,
      type,
      message,
    });
    setTimeout(handleToasterClose, 3000);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadClick = async () => {
    console.log("selectedFile : ", selectedFile);
    if (selectedFile && audioName) {
      try {
        const formData = new FormData();
        // formData.append("file", selectedFile);
        // // formData.append("audioName", audioName);
        // const response = await ApiClient.post("api/v1/playlist/save", formData);

        formData.append("file", selectedFile);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          "https://api-dot-awkat-al-salat.ue.r.appspot.com/api/v1/playlist/save",
          formData,
          config
        );

        if (response.status === 200) {
          handleToasterOpen("success", "File uploaded successfully!");
        } else {
          handleToasterOpen("error", "File upload failed. Please try again.");
        }
      } catch (error) {
        handleToasterOpen(
          "error",
          "An error occurred while uploading the file. Please try again."
        );
      }
    }
  };

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Typography variant="h4">Upload Audio</Typography>
        <Container maxWidth="sm" style={{ marginTop: "20px" }}>
          <Toaster {...toasterState} />
          <Card>
            <CardContent>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileInputChange}
                    style={{ display: "none" }}
                    id="audio-input"
                  />
                  <label htmlFor="audio-input">
                    <Button variant="contained" component="span" fullWidth>
                      Select Audio File
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12}>
                  {previewUrl && (
                    <>
                      <audio
                        src={previewUrl}
                        controls
                        style={{ width: "100%" }}
                      />
                      <Typography variant="subtitle1" align="center">
                        {selectedFile && selectedFile.name}
                      </Typography>
                    </>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Audio Name"
                    variant="outlined"
                    fullWidth
                    value={audioName}
                    onChange={handleAudioNameChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleUploadClick}
                    disabled={!selectedFile || !audioName}
                  >
                    Upload
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Grid>
    </Layout>
  );
}

export default UploadAudio;
