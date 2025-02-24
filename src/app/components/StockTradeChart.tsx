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
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

const stockData = [
  { date: "2025-02-01", price: 100 },
  { date: "2025-02-02", price: 102 },
  { date: "2025-02-03", price: 101 },
  { date: "2025-02-04", price: 105 },
  { date: "2025-02-05", price: 108 },
  { date: "2025-02-06", price: 107 },
  { date: "2025-02-07", price: 110 },
  { date: "2025-02-08", price: 112 },
  { date: "2025-02-09", price: 109 },
  { date: "2025-02-10", price: 115 },
  { date: "2025-02-11", price: 117 },
  { date: "2025-02-12", price: 116 },
  { date: "2025-02-13", price: 114 },
  { date: "2025-02-14", price: 118 },
  { date: "2025-02-15", price: 120 },
  { date: "2025-02-16", price: 123 },
  { date: "2025-02-17", price: 121 },
  { date: "2025-02-18", price: 119 },
  { date: "2025-02-19", price: 122 },
  { date: "2025-02-20", price: 125 },
];

const trades = [
  { date: "2025-02-02", price: 102, type: "buy" },
  { date: "2025-02-05", price: 108, type: "sell" },
  { date: "2025-02-07", price: 110, type: "buy" },
  { date: "2025-02-10", price: 115, type: "sell" },
  { date: "2025-02-13", price: 114, type: "buy" },
  { date: "2025-02-16", price: 123, type: "sell" },
  { date: "2025-02-18", price: 119, type: "buy" },
  { date: "2025-02-20", price: 125, type: "sell" },
];

const StockTradeChart = () => {
  // Calculate 5-day Simple Moving Average
  const smaPeriod = 5;
  const smaData = stockData.map((item, index) => {
    if (index < smaPeriod - 1) {
      return { x: new Date(item.date), y: null }; // Not enough data points yet
    }
    const slice = stockData.slice(index - smaPeriod + 1, index + 1);
    const avg = slice.reduce((sum, curr) => sum + curr.price, 0) / smaPeriod;
    return { x: new Date(item.date), y: avg };
  });

  const chartData = {
    datasets: [
      {
        label: "Stock Price",
        data: stockData.map((item) => ({
          x: new Date(item.date),
          y: item.price,
        })),
        borderColor: "blue",
        tension: 0.1,
        fill: false,
        pointRadius: 1, // Slightly bigger points for visibility
        pointHitRadius: 10, // Larger hit area for tooltip activation
      },
      {
        label: "5-day SMA",
        data: smaData,
        borderColor: "orange",
        tension: 0.1,
        fill: false,
        pointRadius: 0,
        borderDash: [5, 5], // Dashed line for SMA
      },
      {
        label: "Buy Trades",
        data: trades
          .filter((trade) => trade.type === "buy")
          .map((trade) => ({
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
        label: "Sell Trades",
        data: trades
          .filter((trade) => trade.type === "sell")
          .map((trade) => ({
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
  };

  const options = {
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
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price ($)",
        },
        min: 95,
        max: 130,
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
        filter: function (tooltipItem: any, index: number, tooltipItems: any) {
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
  };

  return (
    <div style={{ width: "1200px", height: "600px" }}>
      <h2>Stock Price with Trades and SMA</h2>
      {/* @ts-expect-error comment */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockTradeChart;
