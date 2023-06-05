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
import axios from "axios";

function UploadedAudio() {
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudioList = async () => {
      const config = {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGlhbW1hcmtoYW5iaXR3QGdtYWlsLmNvbSIsImlhdCI6MTY4NTk2MDExOCwiZXhwIjoxNjg2MDQ2NTE4fQ.l4NWE0ZgARnTiIZuXbVk3fXWNfyuzsnIOKXhqbiugZQ",
        },
      };
      try {
        const response = await axios.get(
          "http://aukat-o-salawat-api.ap-northeast-1.elasticbeanstalk.com/api/v1/playlist/",
          config
        );

        if (response.status === 200) {
          const audioFiles = response.data.data.audios.map((audio) => ({
            name: audio.name.split("_")[0], // Extract the part before the underscore
            url: `https://tajammulbucket123.s3.ap-northeast-1.amazonaws.com/${audio.name}`,
          }));
          setAudioList(audioFiles);
          setLoading(false);
        } else {
          console.log("Failed to fetch audio list.");
        }
      } catch (error) {
        console.log("Error fetching audio list: ", error);
      }
    };

    fetchAudioList();
  }, []);

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
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

export default UploadedAudio;
