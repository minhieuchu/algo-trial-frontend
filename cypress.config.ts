/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    setupNodeEvents: (on: any, _config: any) => {
      on("task", {
        log(...message: any) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
