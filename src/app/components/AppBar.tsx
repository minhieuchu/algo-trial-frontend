"use client";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { styled } from "@mui/material";

export default function AppBar() {
  return (
    <AppBarContainer>
      <div
        style={{
          width: "90rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 600,
            fontSize: "1.125rem",
          }}
        >
          <ShowChartIcon />
          AlgoTrial
        </div>
        <LoginButton>Login</LoginButton>
      </div>
    </AppBarContainer>
  );
}

const LoginButton = styled("div")({
  border: "1px solid #3a3a3a",
  borderRadius: "0.5rem",
  padding: "0.35rem 1.25rem",
  cursor: "pointer",
  transition: "0.3s",
  fontSize: "15px",
});

const AppBarContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.75rem 2rem",
});
