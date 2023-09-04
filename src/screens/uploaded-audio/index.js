import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import Layout from "../../components/Layout";
import ApiClient from "../../services/ApiClient";
import Toaster from "../../components/Toaster";

function AudioCard({ audio, handleTogglePlaylist }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <audio src={audio.url} controls style={{ width: "100%" }} />
        <Typography variant="h6">{audio.name}</Typography>
        <Button
          variant="contained"
          onClick={() => handleTogglePlaylist(audio)}
          sx={{ marginTop: 2 }}
        >
          {audio.inPlaylist ? "Remove from Playlist" : "Add to Playlist"}
        </Button>
      </CardContent>
    </Card>
  );
}

function UploadedAudio() {
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleTogglePlaylist = async (audio) => {
    const response = await ApiClient.post(
      `api/v1/playlist/audio/toggle/${audio.id}`
    );
    if (response.status === 200) {
      if (audio.inPlaylist) {
        handleToasterOpen(
          "success",
          "Audio has been removed from the playlist"
        );
      } else {
        handleToasterOpen("success", "Audio has been added to the playlist");
      }
    }
  };

  useEffect(() => {
    const fetchAudioList = async () => {
      try {
        const response = await ApiClient.get("api/v1/playlist/");

        if (response.status === 200) {
          const audioFiles = response.data.data.audios.map((audio) => ({
            id: audio.id,
            name: audio.name.split("_")[0], // Extract the part before the underscore
            url: audio.url,
            inPlaylist: audio.isPlaylist,
          }));
          setAudioList(audioFiles);
          setLoading(false);
        } else {
          handleToasterOpen("error", "Failed to fetch audio list.");
        }
      } catch (error) {
        // handleToasterOpen("error", "Something went wrong.");
      }
    };

    fetchAudioList();
  }, [handleTogglePlaylist]);

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Toaster {...toasterState} />
        <Typography variant="h4">Uploaded Audio</Typography>
        <Container
          maxWidth="lg"
          sx={{
            marginTop: "20px",
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <Grid container spacing={2}>
              {audioList.map((audio) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={audio.name}>
                  <AudioCard
                    audio={audio}
                    handleTogglePlaylist={handleTogglePlaylist}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Grid>
    </Layout>
  );
}

export default UploadedAudio;
