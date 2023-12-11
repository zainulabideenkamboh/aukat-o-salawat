import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link } from "react-router-dom";

import MosqueIcon from "@mui/icons-material/Mosque";
import RouterIcon from "@mui/icons-material/Router";
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  LibraryMusic as LibraryMusicIcon,
  MusicNote as MusicNoteIcon,
  Favorite as FavoriteIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Tune as TuneIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import PasswordIcon from "@mui/icons-material/Password";
import LockIcon from "@mui/icons-material/Lock";
import ExploreIcon from "@mui/icons-material/Explore";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

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
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const handleAudioMenuToggle = () => {
    setAudioMenuOpen((prevOpen) => !prevOpen);
  };

  const handleSettingsMenuToggle = () => {
    setSettingsMenuOpen((prevOpen) => !prevOpen);
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarList>
        <ListItem button component={Link} to="/namaz-timing">
          <ListItemIcon>
            <MosqueIcon />
          </ListItemIcon>
          <ListItemText primary="Namaz Timing" />
        </ListItem>

        {/* Audio */}
        <ListItem button onClick={handleAudioMenuToggle}>
          <ListItemIcon>
            <LibraryMusicIcon />
          </ListItemIcon>
          <ListItemText primary="Audio" />
          {audioMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={audioMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
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
            {/* <ListItem button component={Link} to="/audio-list">
              <ListItemIcon>
                <MusicNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Audio List" />
            </ListItem> */}
            {/* <ListItem button component={Link} to="/favorite-audio">
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Favorite Audio" />
            </ListItem> */}
          </List>
        </Collapse>
        {/* End Audio */}

        {/* <ListItem button component={Link} to="/playback-schedule">
          <ListItemIcon>
            <WatchLaterIcon />
          </ListItemIcon>
          <ListItemText primary="Playback Schedule" />
        </ListItem> */}
        {/* <ListItem button component={Link} to="/generate-code">
          <ListItemIcon>
            <DeveloperModeIcon />
          </ListItemIcon>
          <ListItemText primary="Generate Code" />
        </ListItem> */}
        {/* ... remaining menu items ... */}

        <ListItem button onClick={handleSettingsMenuToggle}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
          {settingsMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={settingsMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/namaz-method">
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText primary="Namaz Methods" />
            </ListItem>
            <ListItem button component={Link} to="/location">
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Location" />
            </ListItem>
            <ListItem button component={Link} to="/configuration">
              <ListItemIcon>
                <TuneIcon />
              </ListItemIcon>
              <ListItemText primary="Configuration" />
            </ListItem>
            <ListItem button component={Link} to="/reset-password">
              <ListItemIcon>
                <PasswordIcon />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button component={Link} to="/purchase-device">
          <ListItemIcon>
            <RouterIcon />
          </ListItemIcon>
          <ListItemText primary="Buy Device" />
        </ListItem>

        <ListItem button component={Link} to="/sign-in">
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("useEmail");
            }}
          />
        </ListItem>
      </SidebarList>
    </SidebarContainer>
  );
};

export default Sidebar;
