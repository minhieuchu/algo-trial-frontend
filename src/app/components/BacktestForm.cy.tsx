import BacktestForm from "./BacktestForm";

describe("Backtest Form Integration", () => {
  const mockResponse = {
    stock_data: {
      "1646006400000": {
        Open: 160.4599560554,
        Close: 162.4871063232,
        High: 162.7823257346,
        Low: 159.839996793,
        Volume: 95056600,
      },
      "1646092800000": {
        Open: 162.0738454702,
        Close: 160.5977630615,
        High: 163.9435588638,
        Low: 159.3873796907,
        Volume: 83474400,
      },
      "1646179200000": {
        Open: 161.7687625039,
        Close: 163.9041595459,
        High: 164.6914063624,
        Low: 160.3517212373,
        Volume: 79724800,
      },
      "1646265600000": {
        Open: 165.7837410403,
        Close: 163.5794525146,
        High: 166.2167276271,
        Low: 162.9103023463,
        Volume: 76678400,
      },
      "1646352000000": {
        Open: 161.8671662243,
        Close: 160.5682067871,
        High: 162.9102618246,
        Low: 159.5152760452,
        Volume: 83737200,
      },
      "1646611200000": {
        Open: 160.7552248737,
        Close: 156.7599639893,
        High: 162.388759772,
        Low: 156.5041000802,
        Volume: 96418800,
      },
    },
    result: {
      portfolio_cash: 10036.001034746214,
      portfolio_value: 10036.001034746214,
      sharpe_ratio: 1.0,
      max_drawdown: 0.0,
      trade_list: [
        {
          ref: 61,
          size: 19,
          price: 151.1489545588176,
          value: 2871.830136617534,
          commission: 0.0,
          pnl: 0.0,
          pnlcomm: 0.0,
          isopen: true,
          isclosed: false,
          dtopen: 1667149200,
          dtclose: 0,
          status: 1,
          long: true,
        },
        {
          ref: 61,
          size: 0,
          price: 153.04374586124993,
          value: 0.0,
          commission: 0.0,
          pnl: 36.00103474621443,
          pnlcomm: 36.00103474621443,
          isopen: false,
          isclosed: true,
          dtopen: 1667149200,
          dtclose: 1667235600,
          status: 2,
          long: true,
        },
      ],
    },
  };

  beforeEach(() => {
    cy.intercept("POST", "v1/backtests", mockResponse).as("backtestRequest");
  });

  it("Submit form and display backtest results", () => {
    cy.mount(<BacktestForm />);
    cy.get('input[name="ticker"]').type("AAPL");
    cy.get('input[name="date-input"]').eq(0).type("03/16/2022");
    cy.get('input[name="date-input"]').eq(1).type("03/16/2023");

    cy.get('button[name="submit"]').click();

    cy.wait("@backtestRequest").then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody).to.deep.equal({
        ticker: "AAPL",
        start_time: 1647363600,
        end_time: 1678899600,
        initial_capital: 10000,
        risk_free_rate: 0,
        strategy: "SMACrossover",
        strategy_params: { fast_sma_period: 15, slow_sma_period: 30 },
        position_sizing: { type: "fixed", value: 10000 },
      });
    });

    cy.get('div[role="dialog"]').should("be.visible");
    cy.get("h2.MuiDialogTitle-root").contains("AAPL");
    cy.get("h2.MuiDialogTitle-root + div > span:first-of-type").contains(
      "Cash:"
    );
  });
});
