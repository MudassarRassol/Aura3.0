"use client";

import { ThemeProvider } from "./theme-provider";
import { Provider } from "react-redux";
import { store } from "@/redux/store/index";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </Provider>
  );
}
