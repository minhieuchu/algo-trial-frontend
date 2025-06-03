"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { BEARER_TOKEN_KEY } from "@/app/constants";
import {
  selectUser,
  setUser,
  useAlgoTrialStore,
} from "@/app/store/algoTrialStore";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function NavBar() {
  const router = useRouter();
  const user = useAlgoTrialStore(selectUser);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(BEARER_TOKEN_KEY);
    setUser(null);
    setAnchorEl(null);
    router.push("/login");
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <NavBarContainer>
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button onClick={handleClick}>{user!.name}</Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
          {/* <div style={{ position: "relative" }}>
            <ButtonStyled onClick={onDownloadClick}>Download</ButtonStyled>
            {readyState === ReadyState.OPEN && downloadStatus == "pending" && (
              <LinearProgressStyled color="secondary" />
            )}
          </div> */}
        </div>
      </div>
    </NavBarContainer>
  );
}

const NavBarContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.75rem 2rem",
});
