import React, { useState, useEffect, useRef } from "react";
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
  IconButton,
  Checkbox,
} from "@mui/material";
import SpotifyWebApi from "spotify-web-api-js";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ApiClient from "../../services/ApiClient";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Toaster from "../../components/Toaster";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

import { styled } from "@mui/material/styles";

const spotifyApi = new SpotifyWebApi();
const clientId = process.env.REACT_APP_CLIENT_ID;

const RedIconButton = styled(IconButton)({
  color: "white",
  backgroundColor: "red",
  "&:hover": {
    backgroundColor: "gray",
  },
  "&:active": {
    color: "red",
  },
});

const GreenIconButton = styled(IconButton)({
  color: "white",
  backgroundColor: "green",
  "&:hover": {
    backgroundColor: "gray",
  },
  "&:active": {
    color: "green",
  },
});

const YellowIconButton = styled(Button)(({ enabled }) => ({
  color: enabled ? "#1976d2" : "gray",
  // backgroundColor: enabled ? "yellow" : "gray",
  // "&:hover": {
  //   backgroundColor: "gray",
  // },
  "&:active": {
    color: enabled ? "#1976d2" : "gray",
  },
}));

const CounterField = ({
  initialValue,
  onChangeCounterHandler,
  // onClickHandleSetReminder,
}) => {
  const [count, setCount] = useState(initialValue);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleCountChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0) {
      setCount(value);
    }
    // setTimeout(() => {
    //   onClickHandleSetReminder();
    // }, 1000);
  };

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
    } else {
      setTimeout(() => {
        onChangeCounterHandler(count);
      }, 2000);
    }
  }, [count]);

  return (
    <Box display="flex" alignItems="center">
      <RedIconButton size="small" onClick={handleDecrement}>
        <RemoveIcon />
      </RedIconButton>
      <TextField
        type="text"
        value={count}
        onChange={handleCountChange}
        inputProps={{
          min: 0,
          style: { textAlign: "center", height: "0px" },
        }}
        style={{
          margin: "0 8px",
          width: "60px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <GreenIconButton size="small" onClick={handleIncrement}>
        <AddIcon />
      </GreenIconButton>
    </Box>
  );
};

const BellIcon = styled(({ enabled, onClick, ...rest }) => (
  <YellowIconButton enabled={enabled} onClick={onClick} {...rest}>
    {enabled ? <NotificationsActiveIcon /> : <NotificationsOffIcon />}
  </YellowIconButton>
))(({ enabled }) => ({
  color: enabled ? "#1976d2" : "gray",
  // backgroundColor: enabled ? "yellow" : "gray",
  // "&:hover": {
  //   backgroundColor: "gray",
  // },
  "&:active": {
    color: enabled ? "#1976d2" : "gray",
  },
}));

const BellIconButton = ({ enabled, onClick }) => {
  const [isBellEnabled, setIsBellEnabled] = useState(enabled);

  const handleBellClick = () => {
    // console.log("handleBellClick is called");
    setIsBellEnabled(!isBellEnabled);
  };

  return (
    <BellIcon
      enabled={isBellEnabled}
      onClick={() => {
        onClick();
        handleBellClick();
      }}
    />
  );
};

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
  const [audioList, setAudioList] = useState([]);
  const [favoriteAudios, setFavoriteAudios] = useState([]); // State for storing favorite audios
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [validationError, setValidationError] = useState("");
  const [validationHoursError, setValidationHoursError] = useState("");
  const [validationMinutesError, setValidationMinutesError] = useState("");
  const [validationSecondsError, setValidationSecondsError] = useState("");
  const [toasterState, setToasterState] = useState({
    open: false,
    type: "",
    message: "",
  });
  const [audioType, setAudioType] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
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

  const setNamazTime = (time) => {
    const defaultTime = time.slice(0, 5);
    const [h, m] = defaultTime.split(":");
    setHours(h);
    setMinutes(m);
    setSeconds("00");
  };

  const handleTimeOpenModal = (time) => {
    setTimeModalOpen(true);
    setNamazTime(time);
  };

  const handleTimeCloseModal = () => {
    setTimeModalOpen(false);
    // setHours("");
    // setMinutes("");
    // setSeconds("");
    setValidationError("");
  };

  // const handleSaveNamazTime = () => {
  //   if (!validateTime(hours, minutes, seconds)) {
  //     setValidationError("Invalid format.");
  //     return;
  //   }

  //   const time = `${hours.padStart(2, "0")}:${minutes.padStart(
  //     2,
  //     "0"
  //   )}:${seconds.padStart(2, "0")}`;
  //   console.log("Namaz time saved:", time);

  //   handleCloseModal();
  // };

  const validateTime = (h, m, s) => {
    const validHours = h >= 0 && h <= 23;
    const validMinutes = m >= 0 && m <= 59;
    const validSeconds = s >= 0 && s <= 59;

    return validHours && validMinutes && validSeconds;
  };

  const handleHoursChange = (e) => {
    const value = e.target.value;
    setHours(value);
    setValidationHoursError("");
    if (value !== "" && !validateTime(value, minutes, seconds)) {
      setValidationHoursError("Invalid hour (0-23).");
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    setMinutes(value);
    setValidationMinutesError("");
    if (value !== "" && !validateTime(hours, value, seconds)) {
      setValidationMinutesError("Invalid minute (0-59).");
    }
  };

  const handleSecondsChange = (e) => {
    const value = e.target.value;
    setSeconds(value);
    setValidationSecondsError("");
    if (value !== "" && !validateTime(hours, minutes, value)) {
      setValidationSecondsError("Invalid second (0-59).");
    }
  };

  useEffect(() => {
    const fetchAudioList = async () => {
      const config = {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGlhbW1hcmtoYW5iaXR3QGdtYWlsLmNvbSIsImlhdCI6MTY4ODQ3ODExMiwiZXhwIjoxNjg4NTY0NTEyfQ.MCvkdXsmkP1MyOgTZCEqydj8p1gvPtcGQyOdCthHgP8",
        },
      };
      try {
        const response = await axios.get(
          "https://salaat-app-391409.an.r.appspot.com/api/v1/playlist/",
          config
        );
        console.log("Response api/v1/playlist/: ", response);
        if (response.status === 200) {
          const audioFiles = response.data.data.audios.map((audio) => ({
            name: audio.name.split("_")[0], // Extract the part before the underscore
            url: audio.url,
            musicId: audio.id,
            duration: audio.size,
            isFav: audio.isFav,
          }));
          const updatedAudioFiles = audioFiles.map((audio) => ({
            ...audio,
            isPlaying: false,
          }));
          setUploadedMusicData(updatedAudioFiles);
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
          `https://salaat-app-391409.an.r.appspot.com/api/v1/reminder/`,
          payload
        );
        const data = response.data;

        if (data.code === 200 && data.message === "SUCCESS") {
          // console.log("data.data is : ", data.data);
          // const timings = JSON.parse(data.data);
          // const updatedNamazTimings = Object.entries(timings).map(
          //   ([name, time]) => ({
          //     name,
          //     time,
          //   })
          // );
          // console.log("data.data is x: ", data.data);

          setNamazTimings(data.data);
        }

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.log("Error fetching namaz timings: ", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchData();
  }, [isChanged]);

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

  useEffect(() => {
    setFilteredUploadedMusic(uploadedMusicData);
  }, [uploadedMusicData]);

  const handleSelectAudio = (namazName) => {
    setSelectedNamaz(namazName);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeModalOpen(false);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleAudioSelect = (audioId, name, type) => {
    setAudioType(type);
    setSelectedAudio(audioId);
    setAudioName(name);
  };

  const handleSaveMusic = () => {
    // console.log(`Selected audio: ${audioName}`);
    handleCloseModal();
  };

  const handleSetReminder = async (namaz, count, isEnabled) => {
    // handleToasterOpen("success", "Reminder set successfully!");

    // console.log("audioFile: ", audioName);
    // console.log("type: ", audioType);
    // console.log("time: ", namaz.time);
    // console.log("isEnabled: ", isEnabled);
    // console.log("Namaz: ", namaz.audioUrl);
    // console.log("AdjustedTime : ", count);

    try {
      const payload = {
        audioFile: audioName,
        type: audioType,
        time: namaz.time,
        adjustedTime: count,
        isEnabled: isEnabled,
        namaz: namaz.namaz,
        audioUrl: namaz.audioUrl,
      };
      const response = await ApiClient.post(
        `https://salaat-app-391409.an.r.appspot.com/api/v1/reminder/save`,
        payload
      );
      const data = response.data;
      // console.log("response here is: ", data);

      if (data.code === 200 && data.message === "SUCCESS") {
        handleToasterOpen("success", "Reminder saved successfully!");
      } else {
        handleToasterOpen("error", "Reminder failed. Please try again.");
      }
    } catch (error) {
      console.log("Error saving reminder: ", error);
      handleToasterOpen(
        "error",
        "An error occurred while saving reminder. Please try again."
      );
    }

    // console.log("audioFile: ", audioName);
    // console.log("type: ", audioType);
    // console.log("time: ", namaz.time);
    // console.log("isEnabled: ", namaz.isEnabled);
    // console.log("Namaz: ", namaz.namaz);
    // console.log("AdjustedTime : ", count);
    // alert("Reminder has been set");
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

  const handleUploadedPlayPause = (previewUrl, trackId) => {
    if (audioPlayer && audioPlayer.src === previewUrl) {
      if (audioPlayer.paused) {
        setAudioPlayer((prevAudioPlayer) => {
          prevAudioPlayer.play();
          return prevAudioPlayer;
        });
        updateUploadedTrackIsPlaying(trackId, true);
      } else {
        setAudioPlayer((prevAudioPlayer) => {
          prevAudioPlayer.pause();
          return prevAudioPlayer;
        });
        updateUploadedTrackIsPlaying(trackId, false);
      }
    } else {
      setAudioPlayer(new Audio(previewUrl));
      updateUploadedTrackIsPlaying(trackId, true);
    }
  };

  const updateUploadedTrackIsPlaying = (trackId, isPlaying) => {
    setUploadedMusicData((prevData) => {
      const newData = [...prevData];
      newData.forEach((playlist) => {
        if (playlist.musicId === trackId) {
          playlist.isPlaying = isPlaying;
        } else {
          playlist.isPlaying = false;
        }
      });
      return newData;
    });
  };

  const postFavoriteAudio = async (musicId) => {
    try {
      const response = await ApiClient.post(
        `https://salaat-app-391409.an.r.appspot.com/api/v1/playlist/audio/fav/${musicId}`
      );
      const data = response.data;
      if (data.code === 200 && data.message === "SUCCESS") {
        handleToasterOpen("success", "Favorite audio added successfully!");
      } else {
        handleToasterOpen("error", "Favorite audio failed. Please try again.");
      }
    } catch (error) {
      // console.log("Error saving favorite audios: ", error);
      handleToasterOpen(
        "error",
        "An error occurred while adding favorite audio. Please try again."
      );
    }
  };

  const handleFavoriteToggle = (musicId) => {
    const updatedMusicData = uploadedMusicData.map((music) => {
      if (music.musicId === musicId) {
        return {
          ...music,
          isFav: !music.isFav, // Toggle the isFav property
        };
      }
      return music;
    });

    setUploadedMusicData(updatedMusicData);

    if (favoriteAudios.includes(musicId)) {
      // If already a favorite, remove it from the list
      setFavoriteAudios(favoriteAudios.filter((id) => id !== musicId));
      // console.log("I am checked : ", favoriteAudios);
      postFavoriteAudio(musicId);
    } else {
      // If not a favorite, add it to the list
      setFavoriteAudios([...favoriteAudios, musicId]);
      // console.log("I am unchecked : ", musicId);
    }
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
        <Toaster {...toasterState} />
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
                    <TableCell>Adjust Schedule</TableCell>
                    <TableCell>Reminder</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {namazTimings.map((namaz, index) => (
                    <TableRow key={index}>
                      <TableCell>{namaz.namaz}</TableCell>
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

                        {/* {audioName} */}
                      </TableCell>
                      <TableCell>
                        <CounterField
                          initialValue={namaz.adjustedTime}
                          onChangeCounterHandler={(count) => {
                            setCount(count);
                            setNamazTime(namaz.time);
                            handleSetReminder(namaz, count, namaz.isEnabled);
                            setIsChanged((prev) => !prev);
                          }}
                          // onClickHandleSetReminder={(count) => {
                          //   console.log("I am count : ", count);
                          //   setNamazTime(namaz.time);
                          //   handleSetReminder(namaz, count);
                          // }}
                        />
                      </TableCell>
                      <TableCell>
                        <BellIconButton
                          enabled={namaz.isEnabled}
                          onClick={() => {
                            // console.log("namaz.isEnabled : ", namaz.isEnabled);

                            setNamazTime(namaz.time);
                            handleSetReminder(namaz, count, !namaz.isEnabled);
                            setIsChanged((prev) => !prev);
                          }}
                        />
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
                selectedOption === "Spotify Audio" ? "secondary" : "primary"
              }
              onClick={() => handleSelectOption("Spotify Audio")}
            >
              Spotify Audio
            </Button>
            <Button
              variant="contained"
              color={
                selectedOption === "Uploaded Audio" ? "secondary" : "primary"
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
                                onChange={() =>
                                  handleAudioSelect(
                                    track.id,
                                    track.title,
                                    "spotify"
                                  )
                                }
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
                                color={
                                  track.isPlaying ? "secondary" : "primary"
                                }
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
                  <TableHead>
                    <TableRow>
                      <TableCell>Selected</TableCell>
                      <TableCell>Title</TableCell>
                      {/* <TableCell>Duration</TableCell> */}
                      <TableCell>Favorite</TableCell>
                      <TableCell>Play/Pause</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUploadedMusic.map((music, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            checked={selectedAudio === music.musicId}
                            onChange={() =>
                              handleAudioSelect(
                                music.musicId,
                                music.name,
                                "uploaded"
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>{music.name}</TableCell>
                        {/* <TableCell>
                          {`${Math.floor(music.duration / 60000)}:${(
                            "0" + Math.floor((music.duration % 60000) / 1000)
                          ).slice(-2)}`}
                        </TableCell> */}

                        <TableCell>
                          {music.isFav ? (
                            <FavoriteIcon
                              color="secondary"
                              onClick={() =>
                                handleFavoriteToggle(music.musicId)
                              }
                            />
                          ) : (
                            <FavoriteBorderIcon
                              onClick={() =>
                                handleFavoriteToggle(music.musicId)
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color={music.isPlaying ? "secondary" : "primary"}
                            size="small"
                            onClick={() => {
                              handleUploadedPlayPause(music.url, music.id);
                              // console.log("isPlaying : ", music.isPlaying);
                            }}
                          >
                            {music.isPlaying ? (
                              <PauseIcon />
                            ) : (
                              <PlayArrowIcon />
                            )}
                          </Button>
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
      <Modal open={timeModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 500,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Namaz Reminder
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <TextField
                type="number"
                value={hours}
                onChange={handleHoursChange}
                label="Hours"
                error={!!validationHoursError}
                helperText={validationHoursError}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                label="Minutes"
                error={!!validationMinutesError}
                helperText={validationMinutesError}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                value={seconds}
                onChange={handleSecondsChange}
                label="Seconds"
                error={!!validationSecondsError}
                helperText={validationSecondsError}
              />
            </Grid>
          </Grid>
          {/* <Button
            variant="contained"
            onClick={handleSaveNamazTime}
            sx={{ mt: 2 }}
          >
            Save
          </Button> */}
          <Button
            variant="contained"
            onClick={handleTimeCloseModal}
            sx={{
              mt: 2,
              ml: "auto",
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 2,
            }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
}

export default NamazTiming;
