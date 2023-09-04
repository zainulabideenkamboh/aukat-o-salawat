import React from "react";
import {
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const UploadedAudioComponent = ({
  searchValue,
  handleSearchUploadedMusic,
  filteredUploadedMusic,
  selectedAudio,
  handleAudioSelect,
  handleUploadedPlayPause,
}) => {
  return (
    <Box>
      <TextField
        fullWidth
        label="Search Uploaded Audio"
        placeholder="Search Uploaded Audio"
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
              {/* <TableCell>Favorite</TableCell> */}
              <TableCell>Play/Pause</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUploadedMusic.map((music, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedAudio === music.musicId}
                    onChange={() => {
                      handleAudioSelect(
                        music.musicId,
                        music.name,
                        "uploaded",
                        music.url
                      );
                      console.log("MUSIC : ", music);
                    }}
                  />
                </TableCell>
                <TableCell>{music.name}</TableCell>
                {/* <TableCell>
              {`${Math.floor(music.duration / 60000)}:${(
                "0" + Math.floor((music.duration % 60000) / 1000)
              ).slice(-2)}`}
            </TableCell> */}

                {/* <TableCell>
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
            </TableCell> */}
                <TableCell>
                  <Button
                    variant="outlined"
                    color={music.isPlaying ? "secondary" : "primary"}
                    size="small"
                    onClick={() => {
                      handleUploadedPlayPause(music.url, music.id);
                    }}
                  >
                    {music.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UploadedAudioComponent;
