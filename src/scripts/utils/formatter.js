// src/scripts/utils/formatter.js

export const showFormattedDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    // If date is a string, convert to Date object
    const dateObject = typeof date === 'string' ? new Date(date) : date;
  
    return dateObject.toLocaleDateString('en-US', options);
  };
  
  // Additional formatting functions
  export const formatTime = (date) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
    };
    
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return dateObject.toLocaleTimeString('en-US', options);
  };
  
  export const formatShortDate = (date) => {
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return dateObject.toLocaleDateString('en-US', options);
  };