"use client";
import { AxiosHeaders } from "axios";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import apiInstance from "@/app/services/algotrialApi";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { styled } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

const sample_user_id = "test_user";

type DownloadStatus = "pending" | "ready";

export default function AppBar() {
  const [websocketConnectStatus, setWebsocketConnectStatus] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(
    null
  );
  const { lastMessage, readyState } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/report?user_id=${sample_user_id}`,
    undefined,
    websocketConnectStatus
  );

  const onDownloadClick = useCallback(() => {
    apiInstance.get(`backtests/report?user_id=${sample_user_id}`);
  }, []);

  const downloadFile = useCallback(async () => {
    try {
      const response = await apiInstance.get(
        `backtests/report/download?user_id=${sample_user_id}`
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
        : `backtest_report_${sample_user_id}.csv`;

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
  }, []);

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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <ButtonStyled>Login</ButtonStyled>
          <div style={{ position: "relative" }}>
            <ButtonStyled onClick={onDownloadClick}>Download</ButtonStyled>
            {readyState === ReadyState.OPEN && downloadStatus == "pending" && (
              <LinearProgressStyled color="secondary" />
            )}
          </div>
        </div>
      </div>
    </AppBarContainer>
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

const AppBarContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.75rem 2rem",
});

export const LinearProgressStyled = styled(LinearProgress)({
  position: "absolute",
  bottom: "-0.5rem",
  left: 0,
  width: "100%",
  borderRadius: "0.75rem",
});
