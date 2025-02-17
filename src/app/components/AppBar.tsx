"use client";
import { styled } from "@mui/material";

export default function AppBar() {
  return (
    <AppBarContainer>
      <div style={{ fontWeight: 600, fontSize: "1.125rem" }}>AlgoTrial</div>
      <LoginButton>Login</LoginButton>
    </AppBarContainer>
  );
}

const LoginButton = styled("div")({
  border: "2px solid #3a3a3a",
  borderRadius: "0.5rem",
  padding: "0.35rem 1.25rem",
  cursor: "pointer",
  transition: "0.3s",
  fontSize: "15px",
  fontWeight: 600,
});

const AppBarContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.75rem 5rem",
});
