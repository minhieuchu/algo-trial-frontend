import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { BacktestParams, BacktestResult, StockData, User } from "@/app/types";

interface AlgoTrialState {
  user: User | null;
  backtestParams: BacktestParams | null;
  stockData: StockData | null;
  backtestResult: BacktestResult | null;
}

type Actions = {
  setUser: (user: User | null) => void;
  setBacktestParams: (params: BacktestParams) => void;
  setStockData: (data: StockData) => void;
  setBacktestResult: (result: BacktestResult) => void;
};

type AlgoTrialStoreType = AlgoTrialState & Actions;

export const useAlgoTrialStore = create(
  persist(
    immer<AlgoTrialStoreType>((set) => ({
      user: null,
      backtestParams: null,
      stockData: null,
      backtestResult: null,

      setUser: (user: User | null) =>
        set((state) => {
          state.user = user;
        }),
      setBacktestParams: (params: BacktestParams) =>
        set((state) => {
          state.backtestParams = params;
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

export const selectUser = (state: AlgoTrialState) => state.user;
export const selectBacktestParams = (state: AlgoTrialState) =>
  state.backtestParams;
export const selectStockData = (state: AlgoTrialState) => state.stockData;
export const selectBacktestResult = (state: AlgoTrialState) =>
  state.backtestResult;

export const { setUser, setBacktestParams, setStockData, setBacktestResult } =
  useAlgoTrialStore.getState();
