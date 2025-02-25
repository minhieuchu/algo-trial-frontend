"use client";

import dayjs from "dayjs";
import { Field, Formik, useFormikContext } from "formik";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import * as Yup from "yup";

import { DialogStyled } from "@/app/components/index.styles";
import StockTradeChart from "@/app/components/StockTradeChart";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import apiInstance from "@/app/services/algotrialApi";
import {
  selectTicker,
  setBacktestResult,
  setStockData,
  setTicker,
  useAlgoTrialStore,
} from "@/app/store/algoTrialStore";
import { BacktestResult, StockData, StrategyParams } from "@/app/types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const positionSizings = {
  fixed: "Fixed",
  percentage: "Percentage of Capital",
};

const strategies = {
  SMACrossover: "Simple Moving Average Crossover",
  Breakout: "Breakout",
  RSI: "Relative Strength Index",
};

type PositionSizing = keyof typeof positionSizings;
type Strategy = keyof typeof strategies;

interface FormFields {
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
}

const validationSchema = Yup.object({
  strategy: Yup.string().oneOf(Object.keys(strategies)).required(),
  ticker: Yup.string()
    .required()
    .test("length", (val) => val.length > 0),
  start_time: Yup.number().required().min(1),
  end_time: Yup.number()
    .min(Yup.ref("start_time"), "End date must be after Start date")
    .required(),
  initial_capital: Yup.number()
    .positive("Initial Capital must be greater than zero")
    .required()
    .min(1),
  risk_free_rate: Yup.number()
    .min(0, "Risk-Free Rate cannot be negative")
    .max(100, "Risk-Free Rate cannot exceed 100%")
    .required(),
  position_sizing: Yup.object({
    type: Yup.string().oneOf(Object.keys(positionSizings)).required(),
    value: Yup.number().min(0).required(),
  }),
});

const InputForm = () => {
  const {
    values,
    submitForm: onSubmit,
    errors,
    setFieldValue,
  } = useFormikContext<FormFields>();

  const handleDateChange = useCallback(
    (field: keyof FormFields) => (value: number) => {
      setFieldValue(field, value);
    },
    [setFieldValue]
  );

  const handleStrategyChange = useCallback(
    (event: ChangeEvent<{ value: Strategy }>) => {
      const strategy = event.target.value;
      setFieldValue("strategy", strategy);

      if (strategy == "SMACrossover") {
        setFieldValue("strategy_params", {
          fast_sma_period: 0,
          slow_sma_period: 1,
        });
      }
      if (strategy == "RSI") {
        setFieldValue("strategy_params", {
          rsi_period: 1,
          rsi_low: 0,
          rsi_high: 1,
        });
      }
      if (strategy == "Breakout") {
        setFieldValue("strategy_params", {
          lookback: 0,
        });
      }
    },
    [setFieldValue]
  );

  const handlePositionSizingChange = useCallback(
    (event: ChangeEvent<{ value: PositionSizing }>) => {
      const positionSizing = event.target.value;
      setFieldValue("position_sizing.type", positionSizing);

      if (positionSizing == "fixed") {
        setFieldValue("position_sizing.value", 1000);
      }
      if (positionSizing == "percentage") {
        setFieldValue("position_sizing.value", 10);
      }
    },
    [setFieldValue]
  );

  return (
    <>
      <Stack direction={"row"} alignItems={"center"} gap={"2rem"}>
        <Field
          as={TextField}
          size="small"
          label="Ticker Symbol"
          sx={{ flexGrow: 1, top: "0.25rem" }}
          name="ticker"
        />

        <Stack direction={"row"} gap={"1rem"}>
          <CustomDatePicker
            label="Start date"
            onChange={handleDateChange("start_time")}
          />
          <CustomDatePicker
            label="End date"
            onChange={handleDateChange("end_time")}
          />
        </Stack>
      </Stack>

      <Stack direction={"row"} gap={"2rem"}>
        <Field
          as={TextField}
          size="small"
          label="Initial Capital ($)"
          name="initial_capital"
          type="number"
          sx={{ flexGrow: 1 }}
        />

        <Field
          as={TextField}
          size="small"
          label="Risk-Free Rate (%)"
          name="risk_free_rate"
          type="number"
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      <Divider />
      <Field
        as={TextField}
        select
        size="small"
        label="Strategy Name"
        name="strategy"
        sx={{ width: "calc(50% - 1rem)" }}
        onChange={handleStrategyChange}
      >
        {Object.entries(strategies).map((strategy) => {
          const [key, value] = strategy;
          return (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          );
        })}
      </Field>

      {values["strategy"] == "SMACrossover" && (
        <Stack direction={"row"} gap={"2rem"}>
          <Field
            as={TextField}
            size="small"
            label="Fast SMA Period"
            name="strategy_params.fast_sma_period"
            type="number"
            sx={{ flexGrow: 1 }}
          />

          <Field
            as={TextField}
            size="small"
            label="Slow SMA Period"
            name="strategy_params.slow_sma_period"
            type="number"
            sx={{ flexGrow: 1 }}
          />
        </Stack>
      )}

      {values["strategy"] == "RSI" && (
        <>
          <Stack direction={"row"} gap={"2rem"}>
            <Field
              as={TextField}
              size="small"
              label="RSI Period"
              name="strategy_params.rsi_period"
              type="number"
              sx={{ flexGrow: 1 }}
            />

            <Field
              as={TextField}
              size="small"
              label="RSI Low"
              name="strategy_params.rsi_low"
              type="number"
              sx={{ flexGrow: 1 }}
            />
          </Stack>
          <Field
            as={TextField}
            size="small"
            label="RSI High"
            name="strategy_params.rsi_high"
            type="number"
            sx={{ width: "calc(50% - 1rem)" }}
          />
        </>
      )}

      {values["strategy"] == "Breakout" && (
        <Field
          as={TextField}
          size="small"
          label="Look-back"
          name="strategy_params.lookback"
          type="number"
          sx={{ width: "calc(50% - 1rem)" }}
        />
      )}

      <Divider />

      <Stack direction={"row"} gap={"2rem"}>
        <Field
          as={TextField}
          select
          size="small"
          label="Position Sizing Method"
          name="position_sizing.type"
          onChange={handlePositionSizingChange}
          sx={{ width: "calc(50% - 1rem)" }}
        >
          {Object.entries(positionSizings).map((positionSizing) => {
            const [key, value] = positionSizing;
            return (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            );
          })}
        </Field>

        {values["position_sizing"]["type"] == "fixed" && (
          <Field
            as={TextField}
            size="small"
            label="Amount ($)"
            name="position_sizing.value"
            type="number"
            sx={{ flexGrow: 1 }}
          />
        )}

        {values["position_sizing"]["type"] == "percentage" && (
          <Field
            as={TextField}
            size="small"
            label="Percentage (%)"
            name="position_sizing.value"
            type="number"
            sx={{ flexGrow: 1 }}
          />
        )}
      </Stack>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          sx={{ width: "fit-content" }}
          disabled={!!Object.keys(errors).length}
          onClick={onSubmit}
        >
          Run Backtest
        </Button>
      </div>
    </>
  );
};

export default function BacktestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ticker = useAlgoTrialStore(selectTicker);
  const initialValues = useMemo(
    (): FormFields => ({
      ticker: "",
      start_time: 0,
      end_time: 0,
      initial_capital: 1000,
      risk_free_rate: 0,
      strategy: "SMACrossover",
      strategy_params: { fast_sma_period: 0, slow_sma_period: 1 },
      position_sizing: {
        type: "fixed",
        value: 1000,
      },
    }),
    []
  );

  const handleDialogClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback(async (values: FormFields) => {
    setIsLoading(true);
    setTicker(values["ticker"]);
    try {
      const { data } = await apiInstance.post<{
        stock_data: StockData;
        result: BacktestResult;
      }>("backtests", values);
      setStockData(data.stock_data);
      setBacktestResult(data.result);
    } catch (error) {
      console.error(error);
    }
    setIsOpen(true);
    setIsLoading(false);
  }, []);

  return (
    <>
      <Box
        component="form"
        sx={{
          width: "55rem",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ marginBottom: "1.5rem" }}
        >
          Backtest Strategy Parameters
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnMount
        >
          <InputForm />
        </Formik>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>

      <DialogStyled onClose={handleDialogClose} open={isOpen}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
          {ticker}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={(theme) => ({
            position: "absolute",
            right: "0.5rem",
            top: "0.5rem",
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <StockTradeChart />
      </DialogStyled>
    </>
  );
}

interface CustomDatePickerProps {
  label: string;
  onChange: (value: number) => void;
}

function CustomDatePicker({ label, onChange }: CustomDatePickerProps) {
  const onDateChange = useCallback(
    (value: dayjs.Dayjs | null) => {
      onChange(value?.unix() ?? 0);
    },
    [onChange]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          sx={{ minWidth: "12rem !important", width: "12rem" }}
          label={label}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
          onChange={onDateChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
