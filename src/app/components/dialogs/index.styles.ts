import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

export const DialogStyled = styled(Dialog)({
  ".MuiPaper-root[role='dialog']": {
    maxWidth: "1300px",
    borderRadius: "0.75rem",
    padding: "0.5rem 2rem 2rem",
  },
});

export const ResultDiv = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  paddingLeft: "1.5rem",
  paddingBottom: "0.5rem",
  fontSize: "0.9rem",

  "& > span > span": {
    fontWeight: 600,
  },
});

export const ViewTradeButton = styled(Button)({
  width: "fit-content",
  fontSize: "0.75rem",
  padding: "0.25rem",
  marginLeft: "1.25rem",
});
