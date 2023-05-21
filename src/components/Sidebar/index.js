import React from "react";
import { styled } from "@mui/material/styles";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import {
  CloudUpload as CloudUploadIcon,
  Code as CodeIcon,
  LibraryMusic as LibraryMusicIcon,
  MusicNote as MusicNoteIcon,
  Favorite as FavoriteIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Tune as TuneIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import MosqueIcon from "@mui/icons-material/Mosque";

const SidebarContainer = styled("aside")(({ isOpen }) => ({
  width: "250px",
  height: "100vh",
  background: "#F5F5F5",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transform: isOpen ? "translateX(0)" : "translateX(-100%)",
  transition: "transform 0.3s ease-in-out",
}));

const SidebarList = styled(List)({
  padding: 0,
});

const Sidebar = ({ isOpen }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarList>
        <ListItem button component={Link} to="/upload-audio">
          <ListItemIcon>
            <CloudUploadIcon />
          </ListItemIcon>
          <ListItemText primary="Upload Audio" />
        </ListItem>

        <ListItem button component={Link} to="/uploaded-audio">
          <ListItemIcon>
            <LibraryMusicIcon />
          </ListItemIcon>
          <ListItemText primary="Uploaded Audio" />
        </ListItem>
        <ListItem button component={Link} to="/audio-list">
          <ListItemIcon>
            <MusicNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Audio List" />
        </ListItem>
        <ListItem button component={Link} to="/namaz-timing">
          <ListItemIcon>
            <MosqueIcon />
          </ListItemIcon>
          <ListItemText primary="Namaz Timing" />
        </ListItem>
        <ListItem button component={Link} to="/favorite">
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favorite" />
        </ListItem>
        <ListItem button component={Link} to="/playback-schedule">
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText primary="Playback Schedule" />
        </ListItem>
        <ListItem button component={Link} to="/generate-code">
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary="Generate Code" />
        </ListItem>
        <ListItem button component={Link} to="/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button component={Link} to="/configurations">
          <ListItemIcon>
            <TuneIcon />
          </ListItemIcon>
          <ListItemText primary="Configurations" />
        </ListItem>
        <ListItem button component={Link} to="/logout">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </SidebarList>
    </SidebarContainer>
  );
};

export default Sidebar;
