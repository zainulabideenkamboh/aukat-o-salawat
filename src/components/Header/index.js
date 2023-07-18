import React from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, IconButton, Avatar, Typography } from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import logo from "../../assets/images/logo.png";
import avatar from "../../assets/images/avatar.avif";

const HeaderContainer = styled(AppBar)({
  borderBottom: "1px solid #E0E0E0",
  backgroundColor: "#4a32a8",
  height: 80,
});

const Header = ({ isOpen, handleSidebarToggle }) => {
  return (
    <HeaderContainer position="static">
      <Toolbar>
        <IconButton onClick={handleSidebarToggle} edge="start">
          {isOpen ? (
            <ChevronLeftIcon sx={{ color: "white", fontSize: "32px" }} />
          ) : (
            <MenuIcon sx={{ color: "white", fontSize: "32px" }} />
          )}
        </IconButton>
        <Avatar
          alt="Logo"
          src={logo}
          sx={{
            marginLeft: "20px",
            height: "120px",
            width: "130px",
            marginTop: "5px",
          }}
        />
        <Avatar alt="User" src={avatar} sx={{ marginLeft: "auto" }} />
        <Typography variant="body1" sx={{ marginLeft: "8px" }}>
          Zain ul Abideen
        </Typography>
      </Toolbar>
    </HeaderContainer>
  );
};

export default Header;
