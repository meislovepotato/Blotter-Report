"use client";

import { Alert, LinearProgress, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

const FeedbackSnackbar = ({
  open,
  message,
  severity = "info",
  onClose,
  duration = 4000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!open) return;

    let animationFrame;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const percent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(percent);

      if (percent > 0) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();

    return () => cancelAnimationFrame(animationFrame);
  }, [open, duration]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%", position: "relative", paddingBottom: "8px" }}
      >
        {message}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 4,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            backgroundColor: "transparent",
          }}
        />
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar;
