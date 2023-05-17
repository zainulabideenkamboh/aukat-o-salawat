import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ApiClient from "../../services/ApiClient";
import Toaster from "../../components/Toaster";
import Layout from "../../components/Layout";

const Container = styled("form")({
  padding: "32px",
  backgroundColor: "#F7F7F7",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  margin: "auto",
  maxWidth: "400px",
  width: "100%",
  position: "relative", // Add this to allow positioning of child elements
});

const Header = styled("h2")({
  textAlign: "center",
  marginTop: "0",
  marginBottom: "32px",
});

const LinkContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between", // Use space-between to position the link on the right side
  alignItems: "center",
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

const Number = styled("input")({
  display: "inline-block",
  border: "2px solid #4a32a8",
  borderRadius: "8px",
  width: "50px",
  height: "50px",
  textAlign: "center",
  lineHeight: "50px",
  fontWeight: "bold",
  fontSize: "24px",
  margin: "0 8px",
  padding: "0",
  appearance: "none",
  outline: "none",
  boxShadow: "none",
  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
    "-webkit-appearance": "none",
    margin: "0",
  },
});

function GenerateCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(["", "", "", "", ""]);
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

  const resendVerificationCodeHandler = async () => {
    console.log("resendVerificationCodeHandler x");
    const email = localStorage.getItem("email");
    try {
      const response = await ApiClient.post("/api/v1/otp/alexa/generate", {
        email,
      });

      console.log("Generate OTP Response : ", response.data);

      if (response.status !== 200) {
        handleToasterOpen("error", "An error occurred while generating OTP.");
      }
    } catch (error) {
      handleToasterOpen("error", "Something went wrong!");
    }
  };

  useEffect(() => {
    resendVerificationCodeHandler();
  }, []);

  const handleCodeChange = (event, index) => {
    const value = event.target.value;
    if (value === "" || (value >= 0 && value <= 9)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  };

  return (
    <Layout>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "80vh" }}
        item
        xs={12}
        sm={8}
        md={9}
      >
        <Toaster {...toasterState} />
        <Container>
          <LinkContainer>
            <StyledLink onClick={() => resendVerificationCodeHandler()}>
              Resend Code
            </StyledLink>{" "}
            {/* new link */}
          </LinkContainer>
          <Header>App Code</Header>
          <NumberContainer>
            {code.map((num, index) => (
              <Number
                key={index}
                type="number"
                value={index + 1}
                onChange={(event) => handleCodeChange(event, index)}
                maxLength="1"
                readOnly
              />
            ))}
          </NumberContainer>
        </Container>
      </Grid>
    </Layout>
  );
}

export default GenerateCode;
