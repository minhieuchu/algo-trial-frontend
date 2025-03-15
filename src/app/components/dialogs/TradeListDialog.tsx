"use client";

import { useMemo } from "react";

import { DialogStyled } from "@/app/components/dialogs/index.styles";
import {
  selectBacktestResult,
  useAlgoTrialStore,
} from "@/app/store/algoTrialStore";
import { TradeInfo } from "@/app/types";
import { formatUnixTimestamp } from "@/app/utils";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface TradeListDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FullTradeInfo extends TradeInfo {
  priceClose?: number;
}

export default function TradeListDialog({
  isOpen,
  onClose,
}: TradeListDialogProps) {
  const backtestResult = useAlgoTrialStore(selectBacktestResult);

  const tradeList = useMemo(() => {
    if (!backtestResult) {
      return [];
    }
    const fullTradeList: FullTradeInfo[] = [];
    backtestResult.trade_list.forEach((trade, index) => {
      if (trade.isopen) {
        let newFullTrade: FullTradeInfo = {
          ...trade,
        };

        if (index + 1 < backtestResult.trade_list.length) {
          const subsequentTrade = backtestResult.trade_list[index + 1];
          if (trade.ref === subsequentTrade.ref) {
            newFullTrade = {
              ...newFullTrade,
              dtclose: subsequentTrade.dtclose,
              priceClose: subsequentTrade.price,
              pnl: subsequentTrade.pnl,
              pnlcomm: subsequentTrade.pnlcomm,
            };
          } else {
            const correspondingClosedTrade = backtestResult.trade_list.find(
              (item) => item.ref === trade.ref && item.isclosed
            );
            if (correspondingClosedTrade) {
              newFullTrade = {
                ...newFullTrade,
                dtclose: correspondingClosedTrade.dtclose,
                priceClose: correspondingClosedTrade.price,
                pnl: correspondingClosedTrade.pnl,
                pnlcomm: correspondingClosedTrade.pnlcomm,
              };
            }
          }
        }
        fullTradeList.push(newFullTrade);
      }
    });

    return fullTradeList;
  }, [backtestResult]);

  if (!backtestResult) {
    return <></>;
  }

  return (
    <DialogStyled onClose={onClose} open={isOpen} className="test-foo">
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
        {"Executed Trades"}
      </DialogTitle>
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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead
            sx={(theme) => ({
              backgroundColor: theme.palette.grey[200],
            })}
          >
            <TableRow>
              <TableCell>{"Date Open"}</TableCell>
              <TableCell align="left">{"Date Close"}</TableCell>
              <TableCell align="left">{"Open Price($)"}</TableCell>
              <TableCell align="left">{"Closed Price($)"}</TableCell>
              <TableCell align="left">{"Size"}</TableCell>
              <TableCell align="left">{"Pnl($)"}</TableCell>
              <TableCell align="left">{"Pnl(commission)($)"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tradeList.map((trade) => (
              <TableRow
                key={`${trade.dtopen}_${trade.dtclose}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {formatUnixTimestamp(trade.dtopen)}
                </TableCell>
                <TableCell align="left">
                  {trade.dtclose > 0 ? formatUnixTimestamp(trade.dtclose) : ""}
                </TableCell>
                <TableCell align="left">{trade.price.toFixed(3)}</TableCell>
                <TableCell align="left">
                  {trade.priceClose ? trade.priceClose.toFixed(3) : ""}
                </TableCell>
                <TableCell align="left">{trade.size}</TableCell>
                <TableCell align="left">{trade.pnl.toFixed(3)}</TableCell>
                <TableCell align="left">{trade.pnlcomm.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogStyled>
  );
}
