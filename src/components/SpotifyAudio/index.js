import React from "react";
import {
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  Box,
  Checkbox,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const SpotifyAudioComponent = ({
  searchValue,
  handleSearchChange,
  filteredSpotifyAudioData,
  selectedAudio,
  handleAudioSelect,
  handlePlayPause,
}) => {
  return (
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
                          handleAudioSelect(track.id, track.title, "spotify")
                        }
                      />
                    </TableCell>
                    <TableCell>{track.title}</TableCell>
                    <TableCell>{track.artist}</TableCell>
                    <TableCell>
                      {Math.floor(track.duration / 60000)}:
                      {(
                        "0" + Math.floor((track.duration % 60000) / 1000)
                      ).slice(-2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color={track.isPlaying ? "secondary" : "primary"}
                        size="small"
                        onClick={() =>
                          handlePlayPause(track.previewUrl, track.id)
                        }
                      >
                        {track.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
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
  );
};

export default SpotifyAudioComponent;
