import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

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
  justifyContent: "flex-end",
  marginBottom: "16px",
});

const StyledLink = styled(Link)({
  color: "#4a32a8",
  textDecoration: "none",
  fontWeight: "bold",
});

const NumberContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
});

const NumberBox = styled("div")({
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
});

const CodeInput = styled("input")({
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  border: "none",
  clip: "rect(0 0 0 0)",
  overflow: "hidden",
  whiteSpace: "nowrap",
});

function CodeVerification() {
  const [code, setCode] = useState("");

  const handleCodeChange = (event) => {
    const value = event.target.value;
    setCode(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Submitted");
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
          <StyledLink to={"/sign-in"}>Back to Sign In</StyledLink>
        </LinkContainer>
        <Header>Enter Code</Header>
        <NumberContainer>
          {[1, 2, 3, 4, 5].map((num) => (
            <NumberBox key={num}>{code[num - 1]}</NumberBox>
          ))}
          <CodeInput
            type="text"
            value={code}
            onChange={handleCodeChange}
            maxLength="5"
          />
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
