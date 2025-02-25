import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { BacktestResult, StockData } from "@/app/types";

interface AlgoTrialState {
  ticker: string;
  stockData: StockData | null;
  backtestResult: BacktestResult | null;
}

type Actions = {
  setTicker: (ticker: string) => void;
  setStockData: (data: StockData) => void;
  setBacktestResult: (result: BacktestResult) => void;
};

type AlgoTrialStoreType = AlgoTrialState & Actions;

export const useAlgoTrialStore = create(
  persist(
    immer<AlgoTrialStoreType>((set) => ({
      ticker: "",
      stockData: null,
      backtestResult: null,

      setTicker: (ticker: string) =>
        set((state) => {
          state.ticker = ticker;
        }),
      setStockData: (data: StockData) =>
        set((state) => {
          state.stockData = data;
        }),
      setBacktestResult: (result: BacktestResult) => {
        set((state) => {
          state.backtestResult = result;
        });
      },
    })),
    {
      name: "BacktestStorage",
      version: 0,
    }
  )
);

export const selectTicker = (state: AlgoTrialState) => state.ticker;
export const selectStockData = (state: AlgoTrialState) => state.stockData;
export const selectBacktestResult = (state: AlgoTrialState) =>
  state.backtestResult;

export const { setTicker, setStockData, setBacktestResult } =
  useAlgoTrialStore.getState();
