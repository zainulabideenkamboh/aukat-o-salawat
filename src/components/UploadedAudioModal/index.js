import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SpotifyAudioComponent from "../SpotifyAudio";
import UploadedAudioComponent from "../UploadedAudio";

const UploadedAudioModal = ({
  modalOpen,
  handleCloseModal,
  selectedOption,
  handleSelectOption,
  searchValue,
  handleSearchChange,
  filteredSpotifyAudioData,
  selectedAudio,
  handleAudioSelect,
  handlePlayPause,
  handleSearchUploadedMusic,
  filteredUploadedMusic,
  handleUploadedPlayPause,
  handleSaveMusic,
}) => {
  return (
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
          {/* <Button
      variant="contained"
      color={
        selectedOption === "Spotify Audio" ? "secondary" : "primary"
      }
      onClick={() => handleSelectOption("Spotify Audio")}
    >
      Spotify Audio
    </Button> */}
          {/* <Button
            variant="contained"
            color={
              selectedOption === "Uploaded Audio" ? "secondary" : "primary"
            }
            onClick={() => handleSelectOption("Uploaded Audio")}
          >
            Uploaded Audio
          </Button> */}
        </Box>

        {/* {selectedOption === "Spotify Audio" && (
          <SpotifyAudioComponent
            searchValue={searchValue}
            handleSearchChange={handleSearchChange}
            filteredSpotifyAudioData={filteredSpotifyAudioData}
            selectedAudio={selectedAudio}
            handleAudioSelect={handleAudioSelect}
            handlePlayPause={handlePlayPause}
          />
        )} */}

        {selectedOption === "Uploaded Audio" && (
          <UploadedAudioComponent
            searchValue={searchValue}
            handleSearchUploadedMusic={handleSearchUploadedMusic}
            filteredUploadedMusic={filteredUploadedMusic}
            selectedAudio={selectedAudio}
            handleAudioSelect={handleAudioSelect}
            handleUploadedPlayPause={handleUploadedPlayPause}
            handleSaveMusic={handleSaveMusic}
          />
        )}
      </Box>
    </Modal>
  );
};

export default UploadedAudioModal;
