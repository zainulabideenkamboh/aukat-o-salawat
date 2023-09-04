import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

const YellowIconButton = styled(Button)(({ enabled }) => ({
  color: enabled ? "#1976d2" : "gray",
  "&:active": {
    color: enabled ? "#1976d2" : "gray",
  },
}));

const BellIcon = styled(({ enabled, onClick, ...rest }) => (
  <YellowIconButton enabled={enabled} onClick={onClick} {...rest}>
    {enabled ? <NotificationsActiveIcon /> : <NotificationsOffIcon />}
  </YellowIconButton>
))(({ enabled }) => ({
  color: enabled ? "#1976d2" : "gray",
  "&:active": {
    color: enabled ? "#1976d2" : "gray",
  },
}));

const BellIconButton = ({ enabled, onClick }) => {
  const [isBellEnabled, setIsBellEnabled] = useState(enabled);

  const handleBellClick = () => {
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

export default BellIconButton;
