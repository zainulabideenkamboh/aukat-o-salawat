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

import ApiClient from "../../services/ApiClient";

import Toaster from "../../components/Toaster";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Container } from "@mui/material";
import DatePicker from "react-datepicker"; // Import the date picker library
import "react-datepicker/dist/react-datepicker.css"; // Import the date picker styles
import { TablePagination } from "@mui/material";

import BellIconButton from "../../components/BellIconButton";

function AudioSchedule() {
  const [toasterState, setToasterState] = useState({
    open: false,
    type: "",
    message: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [audioSchedule, setAudioSchedule] = useState([]);
  const [sortedColumn, setSortedColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedMusicData, setUploadedMusicData] = useState([]);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;

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

  const formatSchedule = (schedule) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Set to false for 24-hour format
    };
    return new Intl.DateTimeFormat("en-US", options).format(schedule);
  };

  const togglePlayback = (rowId, url) => {
    const toggleAudio = createAudioPlayer();

    // Usage:
    toggleAudio(url);

    const updatedRows = audioSchedule.map((row) =>
      row.id === rowId ? { ...row, playing: !row.playing } : row
    );
    setAudioSchedule(updatedRows);
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

  const filteredRows = audioSchedule.filter((row) =>
    row.namaz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (column) => {
    if (column === sortedColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedRows = filteredRows.slice().sort((a, b) => {
    const isAsc = sortDirection === "asc";
    switch (sortedColumn) {
      case "name":
        return isAsc
          ? a.namaz.localeCompare(b.namaz)
          : b.namaz.localeCompare(a.namaz);
      case "duration":
        return isAsc
          ? a.duration.localeCompare(b.duration)
          : b.duration.localeCompare(a.duration);
      // Add more cases for other columns if needed
      default:
        return 0;
    }
  });

  const handleFilterChange = (event) => {
    const selectedColumn = event.target.value;
    if (selectedColumn !== sortedColumn) {
      setSortDirection("asc");
    }
    setSortedColumn(selectedColumn);
    setCurrentPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const [selectedOption1, setSelectedOption1] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption1(option);
  };

  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleKeyChange = (key) => {
    setSelectedKey(key);
  };

  const handleTimeChange = (time, rowIndex) => {
    const updatedSelectedTimes = [...selectedTimes];
    updatedSelectedTimes[rowIndex] = time;
    setSelectedTimes(updatedSelectedTimes);
    setSelectedKey([]);
  };

  function createAudioPlayer() {
    const audio = new Audio();

    return function toggleAudioPlayPause(audioUrl) {
      if (audio.paused || audio.src !== audioUrl) {
        audio.src = audioUrl;
        audio.play();
      } else {
        audio.pause();
      }
    };
  }

  return (
    <>
      <Toaster {...toasterState} />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="quran-schedule-content"
          id="quran-schedule-header"
        >
          <Typography variant="h6">Audio Schedule</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h4" align="center">
                  Audio Playback Schedule
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Search Audio"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              {/* <Grid
                item
                xs={12}
                sm={6}
                style={{ display: "flex", alignItems: "center" }}
              >
                <FormControl variant="outlined" size="small">
                  <InputLabel>Filter By</InputLabel>
                  <Select
                    value={sortedColumn}
                    onChange={handleFilterChange}
                    label="Filter By"
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="duration">Duration</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          onClick={() => handleSort("name")}
                          style={{ cursor: "pointer" }}
                        >
                          Name
                        </TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Schedule</TableCell>
                        <TableCell>Select Time</TableCell>
                        <TableCell>Play/Pause</TableCell>
                        <TableCell>Reminder</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedRows
                        .slice(
                          currentPage * rowsPerPage,
                          currentPage * rowsPerPage + rowsPerPage
                        )
                        .map((row) => (
                          <TableRow key={row.id}>
                            {console.log("ROW : ", row)}
                            <TableCell>{row.audioFile}</TableCell>
                            <TableCell>{row.duration} minutes</TableCell>
                            <TableCell>
                              {selectedTimes[row.id]
                                ? formatSchedule(selectedTimes[row.id])
                                : "Not Set"}
                            </TableCell>
                            <TableCell>
                              <select
                                value={selectedOption1}
                                onChange={(e) =>
                                  handleOptionChange(e.target.value)
                                }
                              >
                                <option value="">Select an option</option>
                                <option value="after">After Namaz</option>
                                <option value="custom">Custom</option>
                              </select>
                              {selectedOption1 === "after" && (
                                <div>
                                  <RadioGroup value={selectedKey}>
                                    <div style={{ display: "flex" }}>
                                      <FormControlLabel
                                        value={`FajarPrayer_${row.id}`}
                                        control={<Radio />}
                                        label="Fajar"
                                        onChange={() =>
                                          handleKeyChange(
                                            `FajarPrayer_${row.id}`
                                          )
                                        }
                                      />
                                      <FormControlLabel
                                        value={`DhuhrPrayer_${row.id}`}
                                        control={<Radio />}
                                        label="Dhuhr"
                                        onChange={() =>
                                          handleKeyChange(
                                            `DhuhrPrayer_${row.id}`
                                          )
                                        }
                                      />
                                      <FormControlLabel
                                        value={`AsrPrayer_${row.id}`}
                                        control={<Radio />}
                                        label="Asr"
                                        onChange={() =>
                                          handleKeyChange(`AsrPrayer_${row.id}`)
                                        }
                                      />
                                      <FormControlLabel
                                        value={`MaghribPrayer_${row.id}`}
                                        control={<Radio />}
                                        label="Maghrib"
                                        onChange={() =>
                                          handleKeyChange(
                                            `MaghribPrayer_${row.id}`
                                          )
                                        }
                                      />
                                      <FormControlLabel
                                        value={`IshaPrayer_${row.id}`}
                                        control={<Radio />}
                                        label="Isha"
                                        onChange={() =>
                                          handleKeyChange(
                                            `IshaPrayer_${row.id}`
                                          )
                                        }
                                      />
                                    </div>
                                  </RadioGroup>
                                </div>
                              )}
                              {selectedOption1 === "custom" && (
                                <div>
                                  <p>Select a time:</p>
                                  <DatePicker
                                    selected={selectedTimes[row.id]}
                                    onChange={(time) =>
                                      handleTimeChange(time, row.id)
                                    }
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat="h:mm aa"
                                  />
                                </div>
                              )}
                            </TableCell>
                            {console.log("ROW : ", row)}
                            <TableCell>
                              {row.playing ? (
                                <PauseCircleOutlineIcon
                                  color="primary"
                                  onClick={() =>
                                    togglePlayback(row.id, row.audioUrl)
                                  }
                                  fontSize="large"
                                />
                              ) : (
                                <PlayCircleOutlineIcon
                                  fontSize="large"
                                  color="primary"
                                  onClick={() =>
                                    togglePlayback(row.id, row.audioUrl)
                                  }
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <TableCell>
                                <BellIconButton
                                  // enabled={namaz.isEnabled}
                                  onClick={async () => {
                                    try {
                                      let selectedValue = "";
                                      if (selectedKey.length > 0) {
                                        selectedValue =
                                          selectedKey.split("_")[0];
                                      }
                                      let formattedTime = "";
                                      let selectedTime = selectedTimes[row.id];
                                      if (selectedTime) {
                                        const date = new Date(selectedTime);
                                        const hours = date.getHours();
                                        const minutes = date.getMinutes();
                                        formattedTime = `${hours
                                          .toString()
                                          .padStart(2, "0")}:${minutes
                                          .toString()
                                          .padStart(2, "0")}`;
                                      }
                                      const updatedObject = {
                                        ...row,
                                        time: formattedTime,
                                        namaz: "Maghrib",
                                        type: "local",
                                        timeZone: "2023-05-20",
                                        after: selectedValue,
                                      };
                                      delete updatedObject.duration;
                                      delete updatedObject.id;
                                      delete updatedObject.playing;

                                      console.log("OBJ : ", updatedObject);
                                      const response = await ApiClient.post(
                                        `api/v1/reminder/save`,
                                        updatedObject
                                      );
                                      const data = response.data;
                                      if (data.code === 200) {
                                        handleToasterOpen(
                                          "success",
                                          "Reminder saved successfully!"
                                        );
                                      } else {
                                        handleToasterOpen(
                                          "error",
                                          "Reminder failed. Please try again."
                                        );
                                      }
                                    } catch (error) {
                                      handleToasterOpen(
                                        "error",
                                        "An error occurred while saving reminder. Please try again."
                                      );
                                    }
                                  }}
                                />
                              </TableCell>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Grid item xs={12} style={{ marginTop: 15 }}>
                  <TablePagination
                    component="div"
                    count={filteredRows.length}
                    page={currentPage}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[]}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} of ${count}`
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default AudioSchedule;
