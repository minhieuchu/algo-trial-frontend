/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import "chartjs-adapter-date-fns";

import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

import {
  selectBacktestParams,
  selectBacktestResult,
  selectStockData,
  useAlgoTrialStore,
} from "@/app/store/algoTrialStore";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

const StockTradeChart = () => {
  const backtestParams = useAlgoTrialStore(selectBacktestParams);
  const stockData = useAlgoTrialStore(selectStockData);
  const backtestResult = useAlgoTrialStore(selectBacktestResult);

  const buyTrades = useMemo(() => {
    if (!backtestResult) {
      return [];
    }
    return backtestResult.trade_list
      .filter((trade) => !trade.isclosed)
      .map((trade) => ({
        date: trade.dtopen * 1000,
        price: trade.price,
      }));
  }, [backtestResult]);

  const sellTrades = useMemo(() => {
    if (!backtestResult) {
      return [];
    }
    return backtestResult.trade_list
      .filter((trade) => trade.isclosed)
      .map((trade) => ({
        date: trade.dtclose * 1000,
        price: trade.price,
      }));
  }, [backtestResult]);

  // const smaPeriod = 5;
  // const smaData = useMemo(
  //   () =>
  //     stockData.map((item, index) => {
  //       if (index < smaPeriod - 1) {
  //         return { x: new Date(item.date), y: null }; // Not enough data points yet
  //       }
  //       const slice = stockData.slice(index - smaPeriod + 1, index + 1);
  //       const avg =
  //         slice.reduce((sum, curr) => sum + curr.price, 0) / smaPeriod;
  //       return { x: new Date(item.date), y: avg };
  //     }),
  //   []
  // );

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          label: backtestParams?.ticker ?? "",
          data: Object.entries(stockData ?? []).map((item) => ({
            x: new Date(parseInt(item[0], 10)),
            y: item[1].Open,
          })),
          borderColor: "blue",
          tension: 0.1,
          fill: false,
          pointRadius: 2,
          pointHitRadius: 10,
        },
        // {
        //   label: "5-day SMA",
        //   data: smaData,
        //   borderColor: "orange",
        //   tension: 0.1,
        //   fill: false,
        //   pointRadius: 0,
        //   borderDash: [5, 5],
        // },
        {
          label: "Buy",
          data: buyTrades.map((trade) => ({
            x: new Date(trade.date),
            y: trade.price,
          })),
          pointBackgroundColor: "green",
          pointBorderColor: "green",
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false,
        },
        {
          label: "Sell",
          data: sellTrades.map((trade) => ({
            x: new Date(trade.date),
            y: trade.price,
          })),
          pointBackgroundColor: "red",
          pointBorderColor: "red",
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false,
        },
      ],
    }),
    [stockData, buyTrades, sellTrades, backtestParams]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              day: "MMM d",
            },
          },
        },
        y: {
          title: {
            display: true,
            text: "Price ($)",
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            generateLabels: (chart: any) => {
              const datasets = chart.data.datasets;
              return datasets.map((dataset: any, index: number) => ({
                text: dataset.label,
                fillStyle: dataset.pointBackgroundColor || dataset.borderColor,
                strokeStyle: dataset.pointBorderColor || dataset.borderColor,
                lineWidth: dataset.showLine === false ? 0 : 2,
                pointStyle: dataset.showLine === false ? "circle" : "line",
                hidden: !chart.isDatasetVisible(index),
                datasetIndex: index,
              }));
            },
          },
        },
        tooltip: {
          mode: "nearest", // Keep default mode
          intersect: true, // Require exact hover over points
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || "";
              if (label) {
                return `${label}: $${context.parsed.y.toFixed(2)}`;
              }
              return `$${context.parsed.y.toFixed(2)}`;
            },
          },
          filter: function (
            tooltipItem: any,
            _index: number,
            tooltipItems: any
          ) {
            const datasetLabel = tooltipItem.dataset.label;
            // If there's a Buy or Sell trade at this point, exclude Stock Price
            const hasTrade = tooltipItems.some(
              (item: any) =>
                (item.dataset.label === "Buy Trades" ||
                  item.dataset.label === "Sell Trades") &&
                item.parsed.x === tooltipItem.parsed.x
            );
            if (datasetLabel === "Stock Price" && hasTrade) {
              return false; // Skip Stock Price if a trade is present
            }
            return true; // Show all other items
          },
        },
      },
    }),
    []
  );

  return (
    <div style={{ width: "1200px", height: "600px" }}>
      {/* @ts-expect-error comment */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockTradeChart;
