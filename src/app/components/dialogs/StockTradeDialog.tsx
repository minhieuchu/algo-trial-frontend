"use client";

import { useCallback, useState } from "react";

import {
  DialogStyled,
  ResultDiv,
  ViewTradeButton,
} from "@/app/components/dialogs/index.styles";
import TradeListDialog from "@/app/components/dialogs/TradeListDialog";
import StockTradeChart from "@/app/components/StockTradeChart";
import {
  selectBacktestParams,
  selectBacktestResult,
  useAlgoTrialStore,
} from "@/app/store/algoTrialStore";
import { formatUnixTimestamp } from "@/app/utils";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

interface StockTradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StockTradeDialog({
  isOpen,
  onClose,
}: StockTradeDialogProps) {
  const [isTradeListDialogOpen, setIsTradeListDialogOpen] = useState(false);
  const backtestParams = useAlgoTrialStore(selectBacktestParams);
  const backtestResult = useAlgoTrialStore(selectBacktestResult);

  const handleTradeListDialogOpen = useCallback(() => {
    setIsTradeListDialogOpen(true);
  }, []);

  const handleTradeListDialogClose = useCallback(() => {
    setIsTradeListDialogOpen(false);
  }, []);

  if (!backtestParams || !backtestResult) {
    return <></>;
  }

  return (
    <DialogStyled onClose={onClose} open={isOpen}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
        {backtestParams.ticker}
        <span
          style={{
            marginLeft: "0.75rem",
            fontSize: "0.75rem",
            fontWeight: 400,
            fontStyle: "italic",
          }}
        >
          {formatUnixTimestamp(backtestParams.start_time)}
          {" ~ "}
          {formatUnixTimestamp(backtestParams.end_time)}
        </span>
      </DialogTitle>
      <ResultDiv>
        <span>
          {"Cash: "}
          <span>{backtestResult.portfolio_cash.toFixed(2) + "$"}</span>
        </span>
        <span>
          {"Portfolio Value: "}
          <span>{backtestResult.portfolio_value.toFixed(2) + "$"}</span>
        </span>
        <span>
          {"Max Drawdown: "}
          <span>{backtestResult.max_drawdown.toFixed(2) + "%"}</span>
        </span>
        <span>
          {"Sharpe Ratio: "}
          <span>{backtestResult.sharpe_ratio.toFixed(2)}</span>
        </span>
      </ResultDiv>
      <ViewTradeButton onClick={handleTradeListDialogOpen}>
        View Trades
      </ViewTradeButton>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: "0.5rem",
          top: "0.5rem",
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <StockTradeChart />
      <TradeListDialog
        isOpen={isTradeListDialogOpen}
        onClose={handleTradeListDialogClose}
      />
    </DialogStyled>
  );
}
