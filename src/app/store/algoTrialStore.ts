import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { BacktestResult } from "@/app/types";

interface AlgoTrialState {
  ticker: string;
  backtestResult: BacktestResult | null;
}

type Actions = {
  setTicker: (ticker: string) => void;
  setBacktestResult: (result: BacktestResult) => void;
};

type AlgoTrialStoreType = AlgoTrialState & Actions;

export const useAlgoTrialStore = create(
  persist(
    immer<AlgoTrialStoreType>((set) => ({
      ticker: "",
      backtestResult: null,

      // Actions
      setTicker: (ticker: string) =>
        set((state) => {
          state.ticker = ticker;
        }),
      setBacktestResult: (result: BacktestResult) => {
        set((state) => {
          state.backtestResult = result;
        });
      },
    })),
    {
      name: "BacktestStorage",
      version: 0, // Increase version when you update store
    }
  )
);

export const selectTicker = (state: AlgoTrialState) => state.ticker;
export const selectBacktestResult = (state: AlgoTrialState) =>
  state.backtestResult;

export const { setTicker, setBacktestResult } = useAlgoTrialStore.getState();
