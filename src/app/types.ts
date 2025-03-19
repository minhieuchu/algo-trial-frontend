import { POSITION_SIZINGS, STRATEGIES } from "@/app/constants";

export type SMACrossoverParams = {
  fast_sma_period: number;
  slow_sma_period: number;
};

export type MomentumParams = {
  period: number;
  threshold: number;
  lookback: number;
};

export type VolumeWeightedParams = {
  vwap_period: number;
  volume_period: number;
  volume_multiplier: number;
};

export type RSIParams = {
  rsi_period: number;
  rsi_low: number;
  rsi_high: number;
};

export type BreakoutParams = {
  lookback: number;
};

export type TradeInfo = {
  ref: number;
  commission: number;
  dtclose: number;
  dtopen: number;
  isclosed: boolean;
  isopen: boolean;
  long: boolean;
  pnl: number;
  pnlcomm: number;
  price: number;
  size: number;
  status: number;
  value: number;
};

export type BacktestResult = {
  max_drawdown: number;
  portfolio_cash: number;
  portfolio_value: number;
  sharpe_ratio?: number;
  trade_list: TradeInfo[];
};

export type StockEntry = {
  Open: number;
  Close: number;
  High: number;
  Low: number;
  Volume: number;
};

export type StockData = Record<string, StockEntry>;

export type StrategyParams =
  | SMACrossoverParams
  | VolumeWeightedParams
  | MomentumParams
  | RSIParams
  | BreakoutParams;

export type PositionSizing = keyof typeof POSITION_SIZINGS;

export type Strategy = keyof typeof STRATEGIES;

export type BacktestParams = {
  ticker: string;
  start_time: number;
  end_time: number;
  initial_capital: number;
  risk_free_rate: number;
  strategy: Strategy;
  strategy_params: StrategyParams;
  position_sizing: {
    type: PositionSizing;
    value: number;
  };
};
