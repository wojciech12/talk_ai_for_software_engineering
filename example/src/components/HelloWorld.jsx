import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './HelloWorld.css';

/**
 * HelloWorld component demonstrating Claude Code best practices
 * Features:
 * - Functional component with hooks
 * - PropTypes for type validation
 * - API integration with error handling
 * - Loading states
 * - Responsive design
 * 
 * @param {Object} props - Component props
 * @param {string} [props.apiEndpoint='/api/hello'] - API endpoint to fetch message
 * @param {string} [props.fallbackMessage='Hello, World!'] - Fallback message if API fails
 */
const HelloWorld = ({ 
  apiEndpoint = '/api/hello', 
  fallbackMessage = 'Hello, World!' 
}) => {
  // State management following React hooks best practices
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestCount, setRequestCount] = useState(0);

  // Effect for fetching data from API
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setMessage(data.data.message);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (err) {
        setError(err.message);
        setMessage(fallbackMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [apiEndpoint, fallbackMessage, requestCount]);

  // Event handlers
  const handleRefresh = () => {
    setRequestCount(prev => prev + 1);
  };

  const handleReset = () => {
    setMessage(fallbackMessage);
    setError(null);
    setIsLoading(false);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="hello-world loading">
        <div className="spinner" />
        <p>Loading message...</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="hello-world">
      <div className="message-container">
        <h2 className="message">{message}</h2>
        
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>API Error: {error}</span>
          </div>
        )}
        
        <div className="stats">
          <p>Requests made: {requestCount}</p>
          <p>Status: {error ? 'Using fallback' : 'Connected to API'}</p>
        </div>
      </div>
      
      <div className="actions">
        <button 
          className="btn btn-primary" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          Refresh Message
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset to Fallback
        </button>
      </div>
    </div>
  );
};

HelloWorld.propTypes = {
  apiEndpoint: PropTypes.string,
  fallbackMessage: PropTypes.string
};

export default HelloWorld;