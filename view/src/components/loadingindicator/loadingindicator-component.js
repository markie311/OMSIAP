import React, { useState, useEffect, useRef } from 'react';

import '../../styles/loadingindicator/loadingindicator.scss';

import { useLoading } from '../loadingcontext/loadingcontext.js';

const LoadingIndicator = ({ isVisible, loadingindicatormodal, loadingindicatormodalcb }) => {
  const { loadingState } = useLoading();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading resources');
  const progressInterval = useRef(null);
  
  // Calculate overall progress based on loading states
  const calculateProgress = () => {
    const totalResources = Object.keys(loadingState).length;
    const loadedResources = Object.values(loadingState).filter(state => state === false).length;
    return Math.max(5, Math.min(100, (loadedResources / totalResources) * 100));
  };
  
  useEffect(() => {
    // If we're visible, start progress animation
    if (isVisible) {
      // Clear any existing interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      // Start a new progress animation
      progressInterval.current = setInterval(() => {
        const calculatedProgress = calculateProgress();
        
        setProgress(prevProgress => {
          // Don't go backwards, and don't jump too far ahead
          const targetProgress = Math.max(prevProgress, 
            Math.min(calculatedProgress, prevProgress + 2));
          
          // Update loading text based on progress
          if (targetProgress >= 30 && targetProgress < 60) {
            setLoadingText('Initializing application');
          } else if (targetProgress >= 60 && targetProgress < 90) {
            setLoadingText('Preparing your experience');
          } else if (targetProgress >= 90) {
            setLoadingText('Almost ready');
          }
          
          // If we've reached 100%, hide the indicator after a short delay
          if (targetProgress >= 100) {
            setTimeout(() => {
              loadingindicatormodalcb('none');
            }, 500);
            clearInterval(progressInterval.current);
          }
          
          return targetProgress;
        });
      }, 100);
    } else {
      // We're not visible, clear the interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    
    // Clean up on component unmount
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isVisible, loadingState]);
  
  // Format progress to display at most one decimal place
  const formattedProgress = Math.min(100, Math.floor(progress * 10) / 10);
  
  if (loadingindicatormodal === 'none') {
    return null;
  }
  
  return (
    <div className="loading-container" style={{ display: loadingindicatormodal }}>
      <div className="loading-content">
        <div className="logo-container">
          <div className="logo">
            {/* Replace with your logo */}
            <span>OMSIAP</span>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${formattedProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span>{loadingText}</span>
            <span className="progress-percentage">{formattedProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;