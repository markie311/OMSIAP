import React, { useState, useEffect } from 'react';
import '../../styles/loadingindicator/loadingindicator.scss';

const LoadingIndicator = (props, onLoadComplete) => {

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading resources');

  useEffect(() => {
    // Simulate fetching resources and loading the site
    const simulateLoading = () => {
      const interval = setInterval(() => {
        setProgress(prevProgress => {
          // Update loading text based on progress
          if (prevProgress >= 30 && prevProgress < 60) {
            setLoadingText('Initializing application');
          } else if (prevProgress >= 60 && prevProgress < 90) {
            setLoadingText('Preparing your experience');
          } else if (prevProgress >= 90) {
            setLoadingText('Almost ready');
          }

          const newProgress = prevProgress + Math.random() * 10;
          
          // When loading completes
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsLoading(false);
              if (onLoadComplete) onLoadComplete();
            }, 500);
          //  props.userdashboardmodalcb("flex");
            return 100;
          }
          
      
          return newProgress;
        });
      }, 400);

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    };

    // Check if the document and all resources are fully loaded
    if (document.readyState === 'complete') {
      simulateLoading();
    } else {
      window.addEventListener('load', simulateLoading);
      return () => window.removeEventListener('load', simulateLoading);
    }
  }, [onLoadComplete]);

  // Format progress to display at most one decimal place
  const formattedProgress = Math.min(100, Math.floor(progress * 10) / 10);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-container"
         style={{display: props.loadingindicatormodal}}>
      <div className="loading-content">
        <div className="logo-container">
          <div className="logo">
            {/* You can replace this with your logo SVG or image */}
            <span>YourLogo</span>
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