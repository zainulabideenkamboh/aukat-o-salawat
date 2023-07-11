import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ApiClient from "../../services/ApiClient";

import axios from "axios";

function PlaybackSchedule() {
  const [loading, setLoading] = useState(true);
  const [audioList, setAudioList] = useState([]);
  const [namazTimings, setNamazTimings] = useState([]);
  const [audioPlayer, setAudioPlayer] = useState(null);

  useEffect(() => {
    const fetchAudioList = async () => {
      const config = {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGlhbW1hcmtoYW5iaXR3QGdtYWlsLmNvbSIsImlhdCI6MTY4ODQ3ODExMiwiZXhwIjoxNjg4NTY0NTEyfQ.MCvkdXsmkP1MyOgTZCEqydj8p1gvPtcGQyOdCthHgP8",
        },
      };
      try {
        const response = await ApiClient.get(
          "https://salaat-app-391409.an.r.appspot.com/api/v1/reminder/"
        );
        console.log("response is here bro: ", response);

        if (response.status === 200) {
          const audioFiles = response.data.data.map((audio) => ({
            url: `https://tajammulbucket123.s3.ap-northeast-1.amazonaws.com/azan1_9e3492e7-76fe-41fb-a303-24122667e536.mp3`,
          }));
          const namazTimingsWithUrl = response.data.data.map(
            (namaz, index) => ({
              ...namaz,
              url: audioFiles[index].url,
              isPlaying: false, // Add the isPlaying property
            })
          );

          // setAudioList(audioFiles);
          setNamazTimings(namazTimingsWithUrl);
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

  function convertDateTime(dateTimeString) {
    const dateObj = new Date(dateTimeString);
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const handlePlayPause = (previewUrl, trackId) => {
    if (audioPlayer && audioPlayer.src === previewUrl) {
      if (audioPlayer.paused) {
        setAudioPlayer((prevAudioPlayer) => {
          prevAudioPlayer.play();
          return prevAudioPlayer;
        });
        updateTrackIsPlaying(trackId, true);
      } else {
        setAudioPlayer((prevAudioPlayer) => {
          prevAudioPlayer.pause();
          return prevAudioPlayer;
        });
        updateTrackIsPlaying(trackId, false);
      }
    } else {
      setAudioPlayer(new Audio(previewUrl));
      updateTrackIsPlaying(trackId, true);
    }
  };

  const updateTrackIsPlaying = (trackId, isPlaying) => {
    setNamazTimings((prevNamazTimings) => {
      return prevNamazTimings.map((namaz) => {
        if (namaz.id === trackId) {
          return {
            ...namaz,
            isPlaying: isPlaying,
          };
        } else {
          return {
            ...namaz,
            isPlaying: false,
          };
        }
      });
    });
  };

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Typography variant="h4">Playback Schedule</Typography>
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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Namaz</TableCell>
                    <TableCell>Reminder Time</TableCell>
                    <TableCell>Audio Type</TableCell>
                    <TableCell>Selected Audio</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {namazTimings.map((namaz, index) => (
                    <TableRow key={index}>
                      <TableCell>{namaz.namaz}</TableCell>
                      <TableCell>{convertDateTime(namaz.time)}</TableCell>
                      <TableCell>{namaz.type}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color={namaz.isPlaying ? "secondary" : "primary"}
                          size="small"
                          onClick={() => handlePlayPause(namaz.url, namaz.id)}
                        >
                          {namaz.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => {}}
                          href="/namaz-timing"
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => {}}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Grid>
    </Layout>
  );
}

export default PlaybackSchedule;
