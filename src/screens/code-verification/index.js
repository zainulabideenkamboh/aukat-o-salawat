import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

const Header = styled("h2")({
  textAlign: "center",
  marginTop: "0",
  marginBottom: "32px",
});

const LinkContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between", // Align the links to the left and right
  marginBottom: "16px",
});

const StyledLink = styled(Link)({
  color: "#4a32a8",
  textDecoration: "none",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
});

const NumberContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
});

const NumberBox = styled("input")({
  border: "2px solid #4a32a8",
  borderRadius: "8px",
  width: "50px",
  height: "50px",
  textAlign: "center",
  lineHeight: "50px",
  fontWeight: "bold",
  fontSize: "24px",
  margin: "0 8px",
});

const StyledArrowBackIcon = styled(ArrowBackIosIcon)({
  marginRight: "8px",
});

function CodeVerification() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state ?? {};
  console.log("Email 1 : ", email);
  const [toasterState, setToasterState] = useState({
    open: false,
    type: "",
    message: "",
  });

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

  const handleCodeChange = (event, index) => {
    let value = event.target.value;
    value = value.replace(/\D/g, ""); // Remove non-numeric characters
    setCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = value[value.length - 1]; // Store the last character
      return newCode;
    });
  };

  const handleSubmit = async (event) => {
    console.log("Email 2 : ", email);
    const concatenatedString = code.join("");
    event.preventDefault();
    try {
      const response = await ApiClient.post("api/v1/otp/validate", {
        email,
        code: concatenatedString,
      });
      if (response.data.status === 200) {
        navigate("/sign-in");
      } else {
        handleToasterOpen("error", "An error occurred while validating OTP.");
      }
    } catch (error) {
      handleToasterOpen("error", "Failed! Something went wrong.");
    }
  };

  const resendCodeHandler = async () => {
    try {
      console.log("Email 3 : ", email);

      const response = await ApiClient.post("api/v1/otp/generate", { email });
      if (response.status === 200) {
        handleToasterOpen(
          "success",
          "OPT has been generated, please check your email."
        );
      } else {
        handleToasterOpen("error", "An error occurred while generating OTP.");
      }
    } catch (error) {
      handleToasterOpen("error", "Failed! Something went wrong.");
    }
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
          <StyledLink to={"/sign-up"}>
            <StyledArrowBackIcon />
            Go Back
          </StyledLink>
          <StyledLink onClick={resendCodeHandler}>Resend Code</StyledLink>
        </LinkContainer>
        <Header>Enter Code</Header>
        <NumberContainer>
          {[1, 2, 3, 4, 5].map((num, index) => (
            <NumberBox
              key={num}
              type="text" // Change type to "text"
              value={code[index]}
              onChange={(event) => handleCodeChange(event, index)}
              maxLength="1"
            />
          ))}
        </NumberContainer>
        <StyledButton
          variant="contained"
          type="submit"
          disabled={code.length < 5}
        >
          Submit
        </StyledButton>
      </Container>
    </Grid>
  );
}

export default CodeVerification;
