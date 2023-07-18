import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import Layout from "../../components/Layout";
import ApiClient from "../../services/ApiClient";
import Toaster from "../../components/Toaster";

function FavoriteAudio() {
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasterState, setToasterState] = useState({
    open: false,
    type: "",
    message: "",
  });
  const [audioType, setAudioType] = useState("");
  const [audioName, setAudioName] = useState("");
  const [count, setCount] = useState(0);
  const [isChanged, setIsChanged] = useState(false);

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
    const fetchAudioList = async () => {
      try {
        const response = await ApiClient.get("api/v1/playlist/audio/fav");

        if (response.status === 200) {
          const audioFiles = response.data.data.map((audio) => ({
            name: audio.name.split("_")[0], // Extract the part before the underscore
            url: audio.url,
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
  }, []);

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Toaster {...toasterState} />
        <Typography variant="h4">Favorite Audio</Typography>
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
                  <Card sx={{ height: "100%" }}>
                    <CardContent>
                      <audio
                        src={audio.url}
                        controls
                        style={{ width: "100%" }}
                      />
                      <Typography variant="h6">{audio.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Grid>
    </Layout>
  );
}

export default FavoriteAudio;
