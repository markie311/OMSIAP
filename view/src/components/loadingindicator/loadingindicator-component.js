import React, { useEffect, useState } from "react";
import "../../styles/loadingindicator/loadingindicator.scss";
import { motion, AnimatePresence } from "framer-motion";
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

  // Hide when done
  useEffect(() => {
    if (!isAnyLoading()) {
      const timer = setTimeout(() => setInternalVisible(false), 800);
      return () => clearTimeout(timer);
    } else {
      setInternalVisible(true);
    }
  }, [isAnyLoading]);

  // Animate progress and messages
  useEffect(() => {
    if (!internalVisible) return;

    let progressInterval;
    let messageIndex = 0;

    setProgress(0);
    setLoadingText(loadingMessages[0]);

    progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 8, 100);
        if (
          next >= ((messageIndex + 1) / loadingMessages.length) * 100 &&
          messageIndex < loadingMessages.length - 1
        ) {
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
      className="loading-container"
      style={{
        display: loadingindicatormodal,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Animated glowing background */}
      <motion.div
        className="loading-background-glow"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="loading-content"
      >
        {/* Animated text */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={loadingText}
            id="pageloadingindicatortext"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="loading-text"
          >
            {loadingText}
          </motion.h2>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
          <motion.p
            className="progress-percentage"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {Math.round(progress)}%
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
