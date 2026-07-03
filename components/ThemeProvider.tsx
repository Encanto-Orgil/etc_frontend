"use client";

import { ConfigProvider, theme } from "antd";
import { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#0c0c0c",
          colorBgBase: "#ffffff",
          colorTextBase: "#0c0c0c",
          fontFamily: '"Inter Variable", "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
          borderRadius: 8,
          colorBorder: "#e8e8e8",
          controlHeight: 44,
        },
        components: {
          Button: { fontWeight: 600, primaryShadow: "none" },
          Input: { colorBgContainer: "#f5f5f5" },
          Collapse: { headerBg: "transparent", contentBg: "transparent" },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
