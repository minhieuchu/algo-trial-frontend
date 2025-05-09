"use client";
import { Field, Formik, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import * as Yup from "yup";

import { BEARER_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/app/constants";
import apiInstance from "@/app/services/algotrialApi";
import {
  selectUser,
  setUser,
  useAlgoTrialStore,
} from "@/app/store/algoTrialStore";
import { User } from "@/app/types";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

function LoginForm() {
  const { submitForm, errors } = useFormikContext();

  return (
    <InputBox>
      <div
        style={{
          fontSize: "1.25rem",
          marginBottom: "0.75rem",
        }}
      >
        Sign In
      </div>
      <Stack direction={"column"} alignItems={"center"} gap={"1rem"}>
        <FieldContainer>
          <label>Email Address</label>
          <Field
            as={TextField}
            size="small"
            sx={{ top: "0.25rem", width: "100%" }}
            inputProps={{ style: { fontSize: 12 } }}
            name="email"
          />
        </FieldContainer>
        <FieldContainer>
          <label>Password</label>
          <Field
            as={TextField}
            size="small"
            sx={{ top: "0.25rem", width: "100%" }}
            inputProps={{ style: { fontSize: 12 } }}
            name="password"
            type="password"
          />
        </FieldContainer>
      </Stack>

      <Divider style={{ marginTop: "1.25rem" }} />
      <Button
        variant="contained"
        color="success"
        name="submit"
        sx={{ width: "100%", marginTop: "1rem" }}
        disabled={!!Object.keys(errors).length}
        onClick={submitForm}
        size="small"
      >
        LOG IN
      </Button>
    </InputBox>
  );
}

export default function Login() {
  const router = useRouter();
  const user = useAlgoTrialStore(selectUser);
  const initialValues = useMemo(
    () => ({
      email: "",
      password: "",
    }),
    []
  );

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = useCallback(
    async (values: { email: string; password: string }) => {
      const formData = new FormData();
      formData.append("username", values.email);
      formData.append("password", values.password);
      const requestConfig = {
        method: "POST",
        url: "auth/login",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      try {
        const { data } = await apiInstance.request<{
          access_token: string;
          refresh_token: string;
        }>(requestConfig);
        localStorage.setItem(BEARER_TOKEN_KEY, data.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
        const { data: user } = await apiInstance.get<User>("/auth/me");
        setUser(user);
        router.push("/");
      } catch (error) {
        setUser(null);
        console.error(error);
      }
    },
    [router]
  );

  if (user) {
    return null;
  }

  return (
    <DivContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "1.5rem",
        }}
      >
        <ShowChartIcon sx={{ fontSize: "1.75rem" }} />
        <span>AlgoTrial</span>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        <LoginForm />
      </Formik>
    </DivContainer>
  );
}

const DivContainer = styled("div")({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2rem",
  paddingTop: "20vh",
});

const InputBox = styled("div")(({ theme }) => ({
  width: "22rem",
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: "0.35rem",
  padding: "1.5rem",
}));

const FieldContainer = styled("div")({
  width: "100%",
  label: {
    fontSize: "0.75rem",
    fontWeight: 600,
  },
});
