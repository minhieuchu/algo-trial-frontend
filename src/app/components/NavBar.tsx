"use client";
import { AxiosHeaders } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { BEARER_TOKEN_KEY } from "@/app/constants";
import apiInstance from "@/app/services/algotrialApi";
import {
  selectUser,
  setUser,
  useAlgoTrialStore,
} from "@/app/store/algoTrialStore";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

type DownloadStatus = "pending" | "ready";

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

  const [websocketConnectStatus, setWebsocketConnectStatus] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(
    null
  );
  const { lastMessage, readyState } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/report?user_id=${user?.id}`,
    undefined,
    websocketConnectStatus
  );

  const onDownloadClick = useCallback(() => {
    apiInstance.get(`backtests/report?user_id=${user?.id}`);
  }, [user]);

  const downloadFile = useCallback(async () => {
    try {
      const response = await apiInstance.get(
        `backtests/report/download?user_id=${user?.id}`
      );
      if (response.status !== 200) {
        return;
      }
      const contentDisposition = (response.headers as AxiosHeaders).get(
        "content-disposition"
      );
      const fileNameMatch = (contentDisposition as string).match(
        /filename=([^;]+\.csv)/
      );
      const fileName = fileNameMatch
        ? fileNameMatch[1]
        : `backtest_report_${user?.id}.csv`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: unknown) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    if (!lastMessage) {
      return;
    }
    const { data } = lastMessage;
    const parsedData = JSON.parse(data);
    const status = parsedData.status as DownloadStatus;
    setDownloadStatus(status);
    if (status === "ready") {
      downloadFile();
    }
  }, [lastMessage, downloadFile]);

  useEffect(() => {
    return () => {
      setWebsocketConnectStatus(false);
    };
  }, []);

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
          <div style={{ position: "relative" }}>
            <ButtonStyled onClick={onDownloadClick}>Download</ButtonStyled>
            {readyState === ReadyState.OPEN && downloadStatus == "pending" && (
              <LinearProgressStyled color="secondary" />
            )}
          </div>
        </div>
      </div>
    </NavBarContainer>
  );
}

const ButtonStyled = styled("div")({
  border: "1px solid #3a3a3a",
  borderRadius: "0.5rem",
  padding: "0.35rem 1.25rem",
  cursor: "pointer",
  transition: "0.3s",
  fontSize: "15px",
});

const NavBarContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.75rem 2rem",
});

const LinearProgressStyled = styled(LinearProgress)({
  position: "absolute",
  bottom: "-0.5rem",
  left: 0,
  width: "100%",
  borderRadius: "0.75rem",
});
