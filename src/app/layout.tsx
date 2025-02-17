import type { Metadata } from "next";
import "./globals.css";

import AppBar from "@/app/components/AppBar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

export const metadata: Metadata = {
  title: "AlgoTrial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <AppBar />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
