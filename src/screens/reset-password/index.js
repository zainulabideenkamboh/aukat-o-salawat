import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import { Link, useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const Container = styled("form")({
  padding: "32px",
  backgroundColor: "#F7F7F7",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  margin: "auto",
  maxWidth: "400px",
  width: "100%",
});

const StyledTextField = styled(TextField)({
  width: "100%",
  marginBottom: "16px",
});

const StyledButton = styled(Button)({
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  backgroundColor: "#4a32a8",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#5432a8",
  },
});

const Icon = styled("span")({
  marginRight: "8px",
});

const Header = styled("h2")({
  textAlign: "center",
  marginTop: "0",
  marginBottom: "32px",
});

const StyledLink = styled(Link)({
  color: "#4a32a8",
  textDecoration: "none",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
});

const LinkContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  marginBottom: "16px",
});

const StyledArrowBackIcon = styled(ArrowBackIosIcon)({
  marginRight: "8px",
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/home");
    // Your reset password submit logic here
  };

  const isValidPassword = (password) => {
    console.log("Checking if password is valid:", password);

    // Password must be at least 8 characters long
    if (password.length < 8) {
      return false;
    }

    // Password must include at least one number, one letter, and one special character
    const regex =
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
    return regex.test(password);
  };

  const isFormValid = () => {
    return isValidPassword(password) && password === confirmPassword;
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Container onSubmit={handleSubmit}>
        <LinkContainer>
          <StyledLink to={"/code-verification"}>
            <StyledArrowBackIcon />
            Go Back
          </StyledLink>
        </LinkContainer>
        <Header>Reset Password</Header>
        <StyledTextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          error={!isValidPassword(password)}
          helperText={
            !isValidPassword(password) &&
            "Password must include number, letter, and special character"
          }
          InputProps={{
            startAdornment: (
              <Icon>
                <LockIcon />
              </Icon>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPasswordClick}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <StyledTextField
          label="Confirm New Password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={password !== confirmPassword}
          helperText={password !== confirmPassword && "Passwords do not match"}
          InputProps={{
            startAdornment: (
              <Icon>
                <LockIcon />
              </Icon>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPasswordClick}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <StyledButton
          variant="contained"
          disabled={!isFormValid()}
          type="submit"
        >
          Reset Password
        </StyledButton>
      </Container>
    </Grid>
  );
}
export default ResetPassword;
