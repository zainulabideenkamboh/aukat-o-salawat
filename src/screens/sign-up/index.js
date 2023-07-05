import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ApiClient from "../../services/ApiClient";
import Toaster from "../../components/Toaster";

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
  marginTop: "-5px",
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

const LinkContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  marginBottom: "16px",
});

const StyledLink = styled(Link)({
  color: "#4a32a8",
  textDecoration: "none",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
});

const StyledArrowBackIcon = styled(ArrowBackIosIcon)({
  marginRight: "8px",
});

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [toasterState, setToasterState] = useState({
    open: false,
    type: "",
    message: "",
  });
  const navigate = useNavigate();

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

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPasswordClick = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFirstNameChange = (event) => {
    const value = event.target.value;
    setFirstName(value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleSerialNumberChange = (event) => {
    const value = event.target.value;
    setSerialNumber(value);
  };

  const handleEmailChange = (event) => {
    const email = event.target.value;
    setEmail(email);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      firstName,
      lastName,
      email,
      serialNumber,
      password,
    };

    try {
      const response = await ApiClient.post("api/v1/auth/signup", payload);
      console.log("SignUp Response : ", response);
      if (response.status === 200) {
        navigate("/code-verification", { state: { email } });
      } else {
        handleToasterOpen(
          "error",
          "An error occurred while creating your account."
        );
      }
    } catch (error) {
      handleToasterOpen("error", "Login Failed! Something went wrong.");
    }
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isValidPassword = (password) => {
    // Password must be at least 8 characters long
    if (password.length < 8) {
      return false;
    }

    // Password must include at least one number, one letter, and one special character
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const isValidSerialNumber = (serialNumber) => {
    return serialNumber.length === 16;
  };

  const isFormValid = () => {
    return (
      firstName.trim() !== "" &&
      isValidEmail(email) &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword === password &&
      isValidPassword(password) &&
      isValidSerialNumber(serialNumber) &&
      serialNumber.trim() !== ""
    );
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Container onSubmit={handleSubmit}>
        <Toaster {...toasterState} />
        <LinkContainer>
          <StyledLink to={"/sign-in"}>
            <StyledArrowBackIcon />
            Go Back
          </StyledLink>
        </LinkContainer>

        <Header>Signup</Header>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              required
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={handleFirstNameChange}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <PersonIcon />
                  </Icon>
                ),
              }}
              error={!firstName.trim()}
              helperText={!firstName.trim() && "First name is required"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={handleLastNameChange}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <PersonIcon />
                  </Icon>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              label="Email Address"
              required
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <EmailIcon />
                  </Icon>
                ),
              }}
              error={!isValidEmail(email)}
              helperText={!isValidEmail(email) && "Invalid email address"}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              required
              label="Serial Number"
              variant="outlined"
              value={serialNumber}
              onChange={handleSerialNumberChange}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <DesktopWindowsIcon />
                  </Icon>
                ),
              }}
              error={!isValidSerialNumber(serialNumber)}
              helperText={
                !isValidSerialNumber(serialNumber) && "Invalid serial number"
              }
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              required
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <LockIcon />
                  </Icon>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPasswordClick}>
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!isValidPassword(password)}
              helperText={
                !isValidPassword(password) &&
                "Password must include number, letter, and special character"
              }
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              required
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              variant="outlined"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <LockIcon />
                  </Icon>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowConfirmPasswordClick}>
                      {showConfirmPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={password !== confirmPassword}
              helperText={
                password !== confirmPassword && "Passwords do not match"
              }
            />
          </Grid>

          <Grid item xs={12}>
            <StyledButton
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isFormValid()}
            >
              Signup
            </StyledButton>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}

export default Signup;
