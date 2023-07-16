import React, { useEffect, useState } from "react";
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
  const { userEmail } = location.state ?? {};
  const [email, setEmail] = useState(userEmail);
  const isForgetPassword = location.state?.isForgetPassword || false;

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
    value = value.replace(/\D/g, ""); // Remove non-numeric characters using regular expression
    value = value.slice(0, 1); // Only take the first character (i.e., restrict to single-digit input)
    setCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = value;
      return newCode;
    });
  };

  const handleSubmit = async (event) => {
    const concatenatedString = code.join("");
    event.preventDefault();
    try {
      const response = await ApiClient.post("api/v1/otp/validate", {
        email,
        code: concatenatedString,
      });
      console.log("Hello data : ", response.data);
      if (response.data.code === 200) {
        navigate(isForgetPassword ? "/reset-password" : "/sign-in", {
          state: { userEmail: email, goBackToSignIn: true },
        });
      } else {
        handleToasterOpen("error", "An error occurred while validating OTP.");
      }
    } catch (error) {
      handleToasterOpen("error", "Failed! Something went wrong.");
    }
  };

  const resendCodeHandler = async () => {
    try {
      const response = await ApiClient.post("api/v1/otp/generate", {
        email,
      });
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

  useEffect(() => {
    resendCodeHandler();
  }, []);

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
          <StyledLink to={isForgetPassword ? "/forget-password" : "/sign-up"}>
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
