"use client";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNotification } from "@/hooks/useNotification";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <NotificationProvider />
    </QueryClientProvider>
  );
}

export const NotificationProvider = () => {
  const { isOpen, message, severity, autoHideDuration, hideNotification } =
    useNotification();

  // 컴포넌트 언마운트 시 알림 초기화 (선택 사항)
  useEffect(() => {
    return () => {
      if (isOpen) {
        hideNotification();
      }
    };
  }, []);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    hideNotification();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ marginTop: "40px" }}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};
