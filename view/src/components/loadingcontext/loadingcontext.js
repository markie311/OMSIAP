import React, { createContext, useState, useContext } from 'react';

// Create a context for managing loading states
export const LoadingContext = createContext();

export function LoadingProvider({ children }) {

    const [loadingState, setLoadingState] = useState({
      global: true,
      user: true,
      products: true,
      transactions: true,
      contents: true,
      // Add other resources as needed
    });
    
    const updateLoadingState = (resource, isLoading) => {
      setLoadingState(prev => ({...prev, [resource]: isLoading}));
    };
    
    const setAllLoaded = () => {
      setLoadingState({
        global: false,
        user: false,
        products: false,
        transactions: false,
        contents: false
        // Set all resources to false
      });
    };
    
    const isAnyLoading = () => {
      return Object.values(loadingState).some(state => state === true);
    };
    
    return (

      <LoadingContext.Provider value={{
        loadingState, 
        updateLoadingState,
        setAllLoaded,
        isAnyLoading
      }}>
        {children}
      </LoadingContext.Provider>
      
    );

  }
  
  // Custom hook for easier access
  export const useLoading = () => useContext(LoadingContext);

