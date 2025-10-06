import React, { useEffect, useState } from "react";
import '../../styles/loadingindicator/loadingindicator.scss';
import { motion } from "framer-motion";
import { useLoading } from "../loadingcontext/loadingcontext.js";

export default function LoadingIndicator({ isVisible, loadingindicatormodal }) {
  const { loadingState, isAnyLoading } = useLoading();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [internalVisible, setInternalVisible] = useState(isVisible);

  const loadingMessages = [
    "Loading user data...",
    "Fetching products...",
    "Retrieving transactions...",
    "Preparing content...",
    "Almost done..."
  ];

  // Animate progress bar and cycle messages
  useEffect(() => {
    if (!isAnyLoading()) {
      // all done, hide after delay
      const timer = setTimeout(() => {
        setInternalVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setInternalVisible(true);
    }
  }, [isAnyLoading]);

  useEffect(() => {
    if (!internalVisible) return;

    let progressInterval;
    let messageIndex = 0;

    setProgress(0);
    setLoadingText(loadingMessages[0]);

    progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + Math.random() * 10, 100);
        if (next >= ((messageIndex + 1) / loadingMessages.length) * 100 && messageIndex < loadingMessages.length - 1) {
          messageIndex++;
          setLoadingText(loadingMessages[messageIndex]);
        }
        return next;
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, [internalVisible]);

  if (!internalVisible) return null;

  return (
    <div
      style={{
        display: loadingindicatormodal,
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.95)",
        zIndex: 9999,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center" }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: "600", color: "#333" }}>
          {loadingText}
        </h2>
        <div
          style={{
            width: "300px",
            height: "15px",
            backgroundColor: "#ddd",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              backgroundColor: "#007bff",
              borderRadius: "10px",
            }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
        <p style={{ marginTop: "10px", fontWeight: "500", color: "#444" }}>
          {Math.round(progress)}%
        </p>
      </motion.div>
    </div>
  );
}
