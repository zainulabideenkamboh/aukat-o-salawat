import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useNavigate } from "react-router-dom";

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

const LinkContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-start", // Align the button to the left
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

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/code-verification");

    // alert("Submitted");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
          <StyledLink to={"/sign-in"}>
            <StyledArrowBackIcon />
            Go Back
          </StyledLink>
        </LinkContainer>
        <Header>Forget Password</Header>
        <StyledTextField
          label="Email"
          value={email}
          onChange={handleEmailChange}
          error={!isValid}
          helperText={!isValid && "Invalid email address"}
          InputProps={{
            startAdornment: (
              <Icon>
                <EmailIcon />
              </Icon>
            ),
          }}
        />
        <StyledButton variant="contained" type="submit" disabled={!isValid}>
          Submit
        </StyledButton>
      </Container>
    </Grid>
  );
}

export default ForgetPassword;
