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
  IconButton,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import SpotifyWebApi from "spotify-web-api-js";
import moment from "moment-timezone";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ApiClient from "../../services/ApiClient";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Toaster from "../../components/Toaster";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Container } from "@mui/material";
import DatePicker from "react-datepicker"; // Import the date picker library
import "react-datepicker/dist/react-datepicker.css"; // Import the date picker styles
import { TablePagination } from "@mui/material";

import { styled } from "@mui/material/styles";
import CounterField from "../../components/CounterField";
import BellIconButton from "../../components/BellIconButton";
import UploadedAudioModal from "../UploadedAudioModal";

const NamazTimings = () => {
  const [loading, setLoading] = useState(true);
  const [namazTimings, setNamazTimings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState("Uploaded Audio");
  const [searchValue, setSearchValue] = useState("");
  const [spotifyAudioData, setSpotifyAudioData] = useState([]);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState("");
  const [uploadedMusicData, setUploadedMusicData] = useState([]);
  const [filteredUploadedMusic, setFilteredUploadedMusic] = useState([]);
  const [filteredSpotifyAudioData, setFilteredSpotifyAudioData] = useState([]);

  const [favoriteAudios, setFavoriteAudios] = useState([]);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [validationHoursError, setValidationHoursError] = useState("");
  const [validationMinutesError, setValidationMinutesError] = useState("");
  const [validationSecondsError, setValidationSecondsError] = useState("");
  const [toasterState, setToasterState] = useState({
    open: false,
    type: "",
    message: "",
  });
  const [audioType, setAudioType] = useState("");
  const [audioName, setAudioName] = useState("");
  const [count, setCount] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [audioSchedule, setAudioSchedule] = useState([]);
  const [sortedColumn, setSortedColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [location, setLocation] = useState({});
  const [isLocation, setIsLocation] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const timezone = moment.tz.guess();
        const data = { latitude, longitude, timezone };
        // console.log("Hello Data : ", data);
        setLocation(data);
        setIsLocation(true);
      });
    }
  }, []);

  const handleSelectAudio = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeModalOpen(false);
  };

  const handleTimeCloseModal = () => {
    setTimeModalOpen(false);
  };

  const setNamazTime = (time) => {
    const defaultTime = time.slice(0, 5);
    const [h, m] = defaultTime.split(":");
    setHours(h);
    setMinutes(m);
    setSeconds("00");
  };

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
        const response = await ApiClient.get("api/v1/playlist/");
        if (response.status === 200) {
          const audioFiles = response.data.data.audios.map((audio) => ({
            name: audio.name.split("_")[0],
            audioFullName: audio.name,
            url: audio.url,
            musicId: audio.id,
            duration: audio.size,
            isFav: audio.isFav,
            isPlaylist: audio.isPlaylist,
          }));
          const updatedAudioFiles = audioFiles.map((audio) => ({
            ...audio,
            isPlaying: false,
          }));
          setUploadedMusicData(updatedAudioFiles);
          const audioSchedule = audioFiles
            .filter((audio) => audio.isPlaylist)
            .map((audio, index) => ({
              id: index + 1,
              audioFile: audio.audioFullName,
              type: "uploaded",
              time: "",
              adjustedTime: 0,
              isEnabled: true,
              namaz: "",
              audioUrl: audio.url,
              reminderType: "quran",
              duration: `${parseInt(audio.duration / 60000)}`,
              playing: false,
            }));
          setAudioSchedule(audioSchedule);

          setLoading(false);
        } else {
          handleToasterOpen("error", "Failed to fetch audio list.");
        }
      } catch (error) {
        handleToasterOpen("error", "Something went wrong.");
      }
    };

    fetchAudioList();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("location.latitude : ", location.latitude);
        // console.log("location.longitude : ", location.longitude);
        // console.log("location?.timezone : ", location?.timezone);

        // const payload = {
        //   lat: 24.860735,
        //   lng: 67.001137,
        //   method: null,
        //   school: 1,
        //   timeZone: "2023-05-20",
        // };

        const payload = {
          lat: location?.latitude,
          lng: location?.longitude,
          method: null,
          school: 1,
          timeZone: "2023-05-20",
        };

        const response = await ApiClient.post("api/v1/reminder/", payload);
        const data = response.data;
        if (data.code === 200 && data.message === "SUCCESS") {
          setNamazTimings(data.data.namaz);
          console.log("Data : ", data);
        }
        setLoading(false);
      } catch (error) {
        handleToasterOpen("error", "Error fetching namaz timings.");
        setLoading(false);
      }
    };

    fetchData();
  }, [isChanged, isLocation]);

  // useEffect(() => {
  //   const hashParams = new URLSearchParams(window.location.hash.substring(1));
  //   const accessToken = hashParams.get("access_token");
  //   if (accessToken) {
  //     spotifyApi.setAccessToken(accessToken);
  //     spotifyApi.getUserPlaylists().then((data) => {
  //       const playlists = data.items.map(async (playlist) => {
  //         const tracksData = await spotifyApi.getPlaylistTracks(playlist.id);
  //         const tracks = tracksData.items.map((item) => {
  //           const track = item.track;
  //           return {
  //             id: track.id,
  //             title: track.name,
  //             artist: track.artists.map((artist) => artist.name).join(", "),
  //             duration: track.duration_ms,
  //             image: track.album.images[0].url,
  //             previewUrl: track.preview_url,
  //             isPlaying: false,
  //           };
  //         });
  //         return {
  //           id: playlist.id,
  //           name: playlist.name,
  //           tracks: tracks,
  //         };
  //       });
  //       Promise.all(playlists).then((values) => {
  //         setSpotifyAudioData(values);
  //       });
  //     });
  //   } else {
  //     const redirectUri = encodeURIComponent(
  //       `${window.location.origin}/namaz-timing`
  //     );
  //     const scope = encodeURIComponent("user-read-private user-read-email");
  //     window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
  //   }
  // }, []);

  //   useEffect(() => {
  //     const filteredSpotifyAudio = spotifyAudioData.map((playlist) => ({
  //       ...playlist,
  //       tracks: playlist.tracks.filter((track) =>
  //         track.title.toLowerCase().includes(searchValue.toLowerCase())
  //       ),
  //     }));
  //     setFilteredSpotifyAudioData(filteredSpotifyAudio);

  //     const filteredMusic = uploadedMusicData.filter((music) =>
  //       music.name.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //     setFilteredUploadedMusic(filteredMusic);
  //   }, [searchValue, spotifyAudioData, uploadedMusicData]);

  useEffect(() => {
    const filteredMusic = uploadedMusicData.filter((music) =>
      music.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUploadedMusic(filteredMusic);
  }, [searchValue]);

  const postFavoriteAudio = async (musicId) => {
    try {
      const response = await ApiClient.post(
        `api/v1/playlist/audio/fav/${musicId}`
      );
      const data = response.data;
      if (data.code === 200) {
        handleToasterOpen("success", "Favorite audio added successfully!");
      } else {
        handleToasterOpen("error", "Favorite audio failed. Please try again.");
      }
    } catch (error) {
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
          isFav: !music.isFav,
        };
      }
      return music;
    });

    setUploadedMusicData(updatedMusicData);

    if (favoriteAudios.includes(musicId)) {
      setFavoriteAudios(favoriteAudios.filter((id) => id !== musicId));
      postFavoriteAudio(musicId);
    } else {
      setFavoriteAudios([...favoriteAudios, musicId]);
    }
  };

  const handleSetReminder = async (namaz, count, isEnabled) => {
    // console.log("namaz : ", namaz);
    // console.log("count : ", count);
    // console.log("isEnabled : ", isEnabled);
    try {
      // const audio =
      //   audioType === "spotify" ? selectedAudio + ".mp3" : audioName + ".mp3";
      const audioFileName = audioName ? audioName + ".mp3" : null;

      //   {
      //     "audioFile": "azaan-dua.mp3",
      //     "type": "local",
      //     "time": "20:16",
      //     "namaz": "IshaPrayer",
      //     "isEnabled": true,
      //     "adjustedTime": 0,
      //     "audioUrl": "https://storage.googleapis.com/download/storage/v1/b/awkat-o-salat/o/azaan-dua_5e2f4f9d-62ec-4008-b475-1aab927623d9.mp3?generation=1693149628709486&alt=media",
      //     "timeZone": "Asia/Karachi",
      //     "createdDate": "2023-08-19",
      //     "updatedDate": "2023-08-22",
      //     "reminderType": "quran",
      //     "after": "Isha"
      // }

      const payload = {
        audioFile: audioFileName, //
        type: "local", //
        time: namaz.time, //
        adjustedTime: count, //
        isEnabled: isEnabled,
        namaz: namaz.namaz,
        audioUrl: audioUrl, //
        reminderType: "namaz", //
        // timeZone: location?.timezone,
        timeZone: "2023-05-20",
        after: null,
      };
      console.log("payload : ", payload);
      const response = await ApiClient.post(`api/v1/reminder/save`, payload);
      // const response = {};
      const data = response.data;
      if (data.code === 200) {
        handleToasterOpen("success", "Reminder saved successfully!");
      } else {
        handleToasterOpen("error", "Reminder failed. Please try again.");
      }
    } catch (error) {
      handleToasterOpen(
        "error",
        "An error occurred while saving reminder. Please try again."
      );
    }
  };

  useEffect(() => {
    setFilteredUploadedMusic(uploadedMusicData);
  }, [uploadedMusicData]);

  useEffect(() => {
    if (audioPlayer) {
      return () => {
        audioPlayer.pause();
      };
    }
  }, [audioPlayer]);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleAudioSelect = (audioId, name, type, audioUrl) => {
    setAudioUrl(audioUrl);
    setAudioType(type);
    setSelectedAudio(audioId);
    setAudioName(name);
  };

  const handleSaveMusic = () => {
    handleCloseModal();
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
  };

  const handleSearchUploadedMusic = (event) => {
    const searchValue = event.target.value;

    setSearchValue(searchValue);
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

  return (
    <>
      <Accordion defaultExpanded>
        <Toaster {...toasterState} />
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="namaz-schedule-content"
          id="namaz-schedule-header"
        >
          <Typography variant="h6">Namaz Schedule</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h4" align="center">
            Namaz Timing
          </Typography>
          <Box p={2}>
            {loading && !isLocation ? (
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
                      <>
                        {(namaz.namaz === "Fajr" ||
                          namaz.namaz === "Dhuhr" ||
                          namaz.namaz === "Asr" ||
                          namaz.namaz === "Maghrib" ||
                          namaz.namaz === "Isha") && (
                          <TableRow key={index}>
                            <TableCell>{namaz.namaz}</TableCell>
                            <TableCell>{namaz.time}</TableCell>

                            <TableCell>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={handleSelectAudio}
                              >
                                Select Audio
                              </Button>
                            </TableCell>
                            <TableCell>
                              <CounterField
                                initialValue={namaz.adjustedTime}
                                onChangeCounterHandler={(count) => {
                                  setCount(count);
                                  setNamazTime(namaz.time);
                                  handleSetReminder(
                                    namaz,
                                    count,
                                    namaz.isEnabled
                                  );
                                  setIsChanged((prev) => !prev);
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <BellIconButton
                                enabled={namaz.isEnabled}
                                onClick={() => {
                                  setNamazTime(namaz.time);
                                  handleSetReminder(
                                    namaz,
                                    count,
                                    !namaz.isEnabled
                                  );
                                  setIsChanged((prev) => !prev);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <UploadedAudioModal
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        selectedOption={selectedOption}
        handleSelectOption={handleSelectOption}
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        filteredSpotifyAudioData={filteredSpotifyAudioData}
        selectedAudio={selectedAudio}
        handleAudioSelect={handleAudioSelect}
        handlePlayPause={handlePlayPause}
        handleSearchUploadedMusic={handleSearchUploadedMusic}
        filteredUploadedMusic={filteredUploadedMusic}
        handleUploadedPlayPause={handleUploadedPlayPause}
        handleSaveMusic={handleSaveMusic}
      />
    </>
  );
};

export default NamazTimings;
