import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Box, TextField, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

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

const CounterField = ({ initialValue, onChangeCounterHandler }) => {
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

export default CounterField;
