"use client";
import BacktestForm from "@/app/components/BacktestForm";
import { selectUser, useAlgoTrialStore } from "@/app/store/algoTrialStore";

export default function Home() {
  const user = useAlgoTrialStore(selectUser);
  if (!user) {
    return null;
  }

  return (
    <div style={{ marginTop: "7rem" }}>
      <BacktestForm />
    </div>
  );
}
