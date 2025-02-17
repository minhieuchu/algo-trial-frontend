export type SMACrossoverParams = {
  fast_sma_period: number;
  slow_sma_period: number;
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
  sharpe_ratio: number;
  trade_list: TradeInfo[];
};

export type StrategyParams = SMACrossoverParams | RSIParams | BreakoutParams;
