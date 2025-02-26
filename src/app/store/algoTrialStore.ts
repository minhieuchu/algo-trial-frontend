import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { BacktestParams, BacktestResult, StockData } from '@/app/types';

interface AlgoTrialState {
  backtestParams: BacktestParams | null;
  stockData: StockData | null;
  backtestResult: BacktestResult | null;
}

type Actions = {
  setBacktestParams: (params: BacktestParams) => void;
  setStockData: (data: StockData) => void;
  setBacktestResult: (result: BacktestResult) => void;
};

type AlgoTrialStoreType = AlgoTrialState & Actions;

export const useAlgoTrialStore = create(
  persist(
    immer<AlgoTrialStoreType>((set) => ({
      backtestParams: null,
      stockData: null,
      backtestResult: null,

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

export const selectBacktestParams = (state: AlgoTrialState) =>
  state.backtestParams;
export const selectStockData = (state: AlgoTrialState) => state.stockData;
export const selectBacktestResult = (state: AlgoTrialState) =>
  state.backtestResult;

export const { setBacktestParams, setStockData, setBacktestResult } =
  useAlgoTrialStore.getState();
