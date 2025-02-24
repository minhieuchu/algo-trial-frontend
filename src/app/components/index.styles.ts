import { styled } from "@mui/material";
import Dialog from "@mui/material/Dialog";

export const DialogStyled = styled(Dialog)({
  ".MuiPaper-root[role='dialog']": {
    maxWidth: "1300px",
    height: "720px",
    borderRadius: "0.75rem",
    padding: "1rem 2rem",
  },
});
