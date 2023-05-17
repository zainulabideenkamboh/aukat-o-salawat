import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import Layout from "../../components/Layout";
import { Grid } from "@mui/material";
import axios from "axios";

const clientId = "572f6a344bdf496c88feda074ea76850";
const clientSecret = "fa91ecdb11594877b955a2619e278c37";

const AudioList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const authResponse = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            },
          }
        );

        const accessToken = authResponse.data.access_token;

        const playlistsResponse = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const playlistsData = playlistsResponse.data.items;
        setPlaylists(playlistsData);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistSelect = async (playlist) => {
    setSelectedPlaylist(playlist);

    try {
      const authResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${clientId}:${clientSecret}`
            ).toString("base64")}`,
          },
        }
      );

      const accessToken = authResponse.data.access_token;

      const tracksResponse = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const tracksData = tracksResponse.data.items;
      setTracks(tracksData);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Typography variant="h4" gutterBottom>
          Spotify Playlists
        </Typography>
        <div>
          {playlists.map((playlist) => (
            <Card
              key={playlist.id}
              onClick={() => handlePlaylistSelect(playlist)}
              sx={{ display: "flex", marginBottom: "10px", cursor: "pointer" }}
            >
              <CardMedia
                component="img"
                alt={playlist.name}
                height="140"
                image={playlist.images[0]?.url}
              />
              <CardContent>
                <Typography variant="h5">{playlist.name}</Typography>
                <Typography variant="subtitle1">
                  {playlist.tracks?.total} tracks
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
        {selectedPlaylist && (
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="h5">
              Selected Playlist: {selectedPlaylist.name}
            </Typography>
            {tracks.map((track) => (
              <div key={track.track.id}>
                <audio src={track.track.preview_url} controls />
              </div>
            ))}
          </Box>
        )}
      </Grid>
    </Layout>
  );
};

export default AudioList;
