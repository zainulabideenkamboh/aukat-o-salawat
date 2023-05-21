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
  Modal,
  Box,
  Paper,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SpotifyWebApi from "spotify-web-api-js";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ApiClient from "../../services/ApiClient";

const spotifyApi = new SpotifyWebApi();
const clientId = process.env.REACT_APP_CLIENT_ID;

function NamazTiming() {
  const [selectedNamaz, setSelectedNamaz] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Spotify Audio");
  const [searchValue, setSearchValue] = useState("");
  const [spotifyAudioData, setSpotifyAudioData] = useState([]);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState("");
  const [uploadedMusicData, setUploadedMusicData] = useState([]);
  const [filteredUploadedMusic, setFilteredUploadedMusic] = useState([]);
  const [filteredSpotifyAudioData, setFilteredSpotifyAudioData] = useState([]);
  const [namazTimings, setNamazTimings] = useState([]);
  const [loading, setLoading] = useState(true); // State for tracking loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          lat: 24.860735,
          lng: 67.001137,
          method: null,
          school: 1,
          timeZone: "2023-05-20",
        };

        const response = await ApiClient.post(
          `http://aukat-o-salawat-api.ap-northeast-1.elasticbeanstalk.com/api/v1/namaz/time`,
          payload
        );
        const data = response.data;

        if (data.code === 200 && data.message === "SUCCESS") {
          const timings = JSON.parse(data.data);
          const updatedNamazTimings = Object.entries(timings).map(
            ([name, time]) => ({
              name,
              time,
            })
          );
          setNamazTimings(updatedNamazTimings);
        }

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.log("Error fetching namaz timings: ", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.getUserPlaylists().then((data) => {
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
              isPlaying: false, // Add isPlaying state for each track
            };
          });
          return {
            id: playlist.id,
            name: playlist.name,
            tracks: tracks,
          };
        });
        Promise.all(playlists).then((values) => {
          setSpotifyAudioData(values);
        });
      });
    } else {
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/namaz-timing`
      );
      const scope = encodeURIComponent("user-read-private user-read-email");
      window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
    }
  }, []);

  useEffect(() => {
    if (audioPlayer) {
      return () => {
        audioPlayer.pause();
      };
    }
  }, [audioPlayer]);

  const handleSelectAudio = (namazName) => {
    setSelectedNamaz(namazName);
    setModalOpen(true);
  };

  const handleSelectSchedule = () => {
    console.log("handleSelectSchedule");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleAudioSelect = (audioId) => {
    setSelectedAudio(audioId);
  };

  const handleSaveMusic = () => {
    console.log(`Selected audio: ${selectedAudio}`);
    handleCloseModal();
  };

  const handleSetReminder = (namaz) => {
    console.log("handleSetReminder");
    alert("Reminder has been set");
  };

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
    setSpotifyAudioData((prevData) => {
      const newData = [...prevData];
      newData.forEach((playlist) => {
        playlist.tracks.forEach((track) => {
          if (track.id === trackId) {
            track.isPlaying = isPlaying;
          } else {
            track.isPlaying = false;
          }
        });
      });
      return newData;
    });
  };

  useEffect(() => {
    // Filter Spotify audio based on the search value
    const filteredSpotifyAudio = spotifyAudioData.map((playlist) => ({
      ...playlist,
      tracks: playlist.tracks.filter((track) =>
        track.title.toLowerCase().includes(searchValue.toLowerCase())
      ),
    }));
    setFilteredSpotifyAudioData(filteredSpotifyAudio);

    // Filter uploaded music based on the search value
    const filteredMusic = uploadedMusicData.filter((music) =>
      music.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUploadedMusic(filteredMusic);
  }, [searchValue, spotifyAudioData, uploadedMusicData]);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
  };

  const handleSearchUploadedMusic = (event) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
  };

  return (
    <Layout>
      <Grid item xs={12} sm={8} md={9}>
        <Typography variant="h4">Namaz Timing</Typography>
        <Box p={2}>
          {loading ? ( // Show the loader if the loading state is true
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
                    <TableCell>Time</TableCell>
                    <TableCell>Select Audio</TableCell>
                    <TableCell>Select Schedule</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {namazTimings.map((namaz, index) => (
                    <TableRow key={index}>
                      <TableCell>{namaz.name}</TableCell>
                      <TableCell>{namaz.time}</TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleSelectAudio(namaz.name)}
                        >
                          Select Audio
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleSelectSchedule(namaz.name)}
                        >
                          Select Schedule
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSetReminder(namaz.name)}
                        >
                          Set Reminder
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

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "600px",
            bgcolor: "background.paper",
            p: 4,
            outline: "none",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Select Audio Option
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <Button
              variant="contained"
              color={
                selectedOption === "Spotify Audio" ? "primary" : "secondary"
              }
              onClick={() => handleSelectOption("Spotify Audio")}
            >
              Spotify Audio
            </Button>
            <Button
              variant="contained"
              color={
                selectedOption === "Uploaded Audio" ? "primary" : "secondary"
              }
              onClick={() => handleSelectOption("Uploaded Audio")}
            >
              Uploaded Audio
            </Button>
          </Box>

          {selectedOption === "Spotify Audio" && (
            <Box>
              <TextField
                fullWidth
                label="Search Spotify Audio"
                placeholder="Search Spotify Audio"
                value={searchValue}
                onChange={handleSearchChange}
                sx={{ marginBottom: 2 }}
              />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Selected</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Artist</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Play/Pause</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSpotifyAudioData.map((playlist) => (
                      <React.Fragment key={playlist.id}>
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {playlist.name}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {playlist.tracks.map((track) => (
                          <TableRow key={track.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedAudio === track.id}
                                onChange={() => handleAudioSelect(track.id)}
                              />
                            </TableCell>
                            <TableCell>{track.title}</TableCell>
                            <TableCell>{track.artist}</TableCell>
                            <TableCell>
                              {Math.floor(track.duration / 60000)}:
                              {(
                                "0" +
                                Math.floor((track.duration % 60000) / 1000)
                              ).slice(-2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() =>
                                  handlePlayPause(track.previewUrl, track.id)
                                }
                              >
                                {track.isPlaying ? (
                                  <PauseIcon />
                                ) : (
                                  <PlayArrowIcon />
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {selectedOption === "Uploaded Audio" && (
            <Box>
              <TextField
                fullWidth
                label="Search Uploaded Music"
                placeholder="Search Uploaded Music"
                value={searchValue}
                onChange={handleSearchUploadedMusic}
                sx={{ marginBottom: 2 }}
              />
              <TableContainer>
                <Table>
                  <TableBody>
                    {filteredUploadedMusic.map((music) => (
                      <TableRow key={music.id}>
                        <TableCell>{music.name}</TableCell>
                        <TableCell>{music.artist}</TableCell>
                        <TableCell>{music.duration}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handlePlayPause(music.id)}
                          >
                            {music.isPlaying ? (
                              <PauseIcon />
                            ) : (
                              <PlayArrowIcon />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedAudio === music.id}
                            onChange={() => handleAudioSelect(music.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveMusic}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
}

export default NamazTiming;
