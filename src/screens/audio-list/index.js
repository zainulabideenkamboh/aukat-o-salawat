import React, { useState, useEffect, useRef } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  LinearProgress,
  Box,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import Layout from "../../components/Layout";

import { PlayCircleFilled, PauseCircleFilled } from "@mui/icons-material";

const spotifyApi = new SpotifyWebApi();
const clientId = process.env.REACT_APP_CLIENT_ID;

function AudioList() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      // Use the Spotify Web API to get the current user's playlists
      spotifyApi.getUserPlaylists().then((data) => {
        // Find the playlists with their respective tracks and set the state with the playlist objects
        const playlists = data.items.map(async (playlist) => {
          const tracksData = await spotifyApi.getPlaylistTracks(playlist.id);
          const tracks = tracksData.items.map((item) => {
            const track = item.track;
            return {
              id: track.id,
              title: track.name,
              artist: track.artists.map((artist) => artist.name).join(", "),
              duration: track.duration_ms,
              image: track.album.images[0].url,
              previewUrl: track.preview_url,
            };
          });
          return {
            id: playlist.id,
            name: playlist.name,
            tracks: tracks,
          };
        });
        Promise.all(playlists).then((values) => {
          setPlaylists(values);
        });
      });
    } else {
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/audio-list`
      );
      const scope = encodeURIComponent("user-read-private user-read-email");
      window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
    }
  }, []);

  const handleSongClick = (song) => {
    if (currentSong && currentSong.id === song.id) {
      // If the same song is clicked again, toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // Pause the currently playing song, if any
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  return (
    <Layout>
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        sx={{ marginBottom: "30%", marginRight: "100px" }}
      >
        <Typography sx={{ m: 3 }} variant="h4">
          {" "}
          Spotify Playlist
        </Typography>

        {currentSong && (
          <Box p={2} display="flex" alignItems="center">
            <Box
              position="relative"
              width="100%"
              height="0"
              paddingBottom="40%"
            >
              <CardMedia
                component="img"
                src={currentSong.image}
                alt={currentSong.title}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
              />
              <CardMedia
                component="video"
                src={currentSong.previewUrl}
                controls
                autoPlay={isPlaying}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              />

              {isPlaying ? (
                <IconButton
                  onClick={handleAudioPause}
                  style={{
                    position: "absolute",
                    bottom: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <PauseCircleFilled style={{ fontSize: 64, color: "#fff" }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={handleAudioPlay}
                  style={{
                    position: "absolute",
                    bottom: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <PlayCircleFilled style={{ fontSize: 64, color: "#fff" }} />
                </IconButton>
              )}
            </Box>
            <Box ml={2} flexGrow={1}>
              <Typography variant="body1" component="p">
                {currentSong.title}
              </Typography>
              <Typography color="textSecondary">
                {currentSong.artist}
              </Typography>
            </Box>
          </Box>
        )}
        {playlists.map((playlist, index) => (
          <Box key={playlist.id} flexGrow={1}>
            {/* {index !== 0 && <Divider sx={{ my: 2 }} />}{" "} */}
            {/* Separator between playlists */}
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: "#f9f9f9",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                align="left"
                sx={{ m: 0, fontWeight: "bold", fontSize: "1.5rem" }}
              >
                {playlist.name}
              </Typography>
            </Paper>
            <Grid container spacing={3} sx={{ overflow: "auto" }}>
              {playlist.tracks.map((track) => (
                <Grid item xs={12} md={6} lg={4} key={track.id}>
                  <Card sx={{ border: "1px solid #ccc" }}>
                    <CardActionArea onClick={() => handleSongClick(track)}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={track.image}
                        alt={track.title}
                      />
                      <CardContent>
                        <Typography variant="body1" component="p">
                          {track.title}
                        </Typography>
                        <Typography color="textSecondary">
                          {track.artist}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Layout>
  );
}

export default AudioList;
