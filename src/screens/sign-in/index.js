import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
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

const RememberMe = styled(FormControlLabel)({
  alignSelf: "flex-start",
  marginRight: "auto",
});

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await ApiClient.post("api/v1/auth/authenticate", {
        email,
        password,
      });
      const { token } = response.data.data;
      localStorage.setItem("token", token);
      if (response.status === 200) {
        localStorage.setItem("userEmail", email);
        navigate("/namaz-timing");
      } else {
        handleToasterOpen(
          "error",
          "An error occurred while login your account."
        );
      }
    } catch (error) {
      handleToasterOpen(
        "error",
        "Login Failed! Either email or password is incorrect."
      );
    }
  };

  const isValidEmail = (email) => {
    // Your email validation logic here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const isFormValid = () => {
    return isValidEmail(email) && isValidPassword(password);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const storedRememberMe = localStorage.getItem("rememberMe");
    if (storedEmail && storedPassword && storedRememberMe === "true") {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      localStorage.removeItem("rememberMe");
    }
  }, [email, password, rememberMe]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Toaster {...toasterState} />
      <Container onSubmit={handleSubmit}>
        <Header>Sign In</Header>
        <StyledTextField
          label="Email Address"
          value={email}
          onChange={handleEmailChange}
          error={!isValidEmail(email)}
          helperText={!isValidEmail(email) && "Invalid email address"}
          InputProps={{
            startAdornment: (
              <Icon>
                <EmailIcon />
              </Icon>
            ),
          }}
          required
        />
        <StyledTextField
          label="Password"
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
          required
        />

        <Grid container justifyContent="space-between">
          <RememberMe
            control={
              <Checkbox
                checked={rememberMe}
                onChange={handleRememberMeChange}
                name="rememberMe"
                color="primary"
              />
            }
            label="Remember me"
          />
          <Grid container justifyContent="space-between">
            <Link component={RouterLink} to="/forget-password">
              Forgot password?
            </Link>
            <Link component={RouterLink} to="/sign-up">
              Create an account
            </Link>
          </Grid>
        </Grid>
        <StyledButton
          variant="contained"
          color="primary"
          type="submit"
          disabled={!isFormValid()}
        >
          Login
        </StyledButton>
      </Container>
    </Grid>
  );
}

export default SignIn;
