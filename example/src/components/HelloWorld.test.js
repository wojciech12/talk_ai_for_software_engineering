import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HelloWorld from './HelloWorld';

// Mock fetch globally
global.fetch = jest.fn();

describe('HelloWorld Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful API Response', () => {
    it('renders message from API successfully', async () => {
      // Mock successful API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { message: 'Hello from API!' }
        }),
      });

      render(<HelloWorld />);

      // Should show loading initially
      expect(screen.getByText('Loading message...')).toBeInTheDocument();

      // Wait for API call to complete
      await waitFor(() => {
        expect(screen.getByText('Hello from API!')).toBeInTheDocument();
      });

      // Should show connected status
      expect(screen.getByText('Status: Connected to API')).toBeInTheDocument();
    });

    it('handles custom API endpoint', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { message: 'Custom endpoint response' }
        }),
      });

      render(<HelloWorld apiEndpoint="/api/custom" />);

      await waitFor(() => {
        expect(screen.getByText('Custom endpoint response')).toBeInTheDocument();
      });

      expect(fetch).toHaveBeenCalledWith('/api/custom');
    });
  });

  describe('API Error Handling', () => {
    it('shows fallback message when API fails', async () => {
      // Mock API failure
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<HelloWorld fallbackMessage="Fallback Hello!" />);

      await waitFor(() => {
        expect(screen.getByText('Fallback Hello!')).toBeInTheDocument();
      });

      // Should show error status
      expect(screen.getByText('Status: Using fallback')).toBeInTheDocument();
      expect(screen.getByText(/API Error: Network error/)).toBeInTheDocument();
    });

    it('handles HTTP error responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      render(<HelloWorld />);

      await waitFor(() => {
        expect(screen.getByText('Hello, World!')).toBeInTheDocument();
      });

      expect(screen.getByText(/API Error: HTTP error! status: 500/)).toBeInTheDocument();
    });

    it('handles API success=false responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: 'Custom API error'
        }),
      });

      render(<HelloWorld />);

      await waitFor(() => {
        expect(screen.getByText(/API Error: Custom API error/)).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('refreshes message when refresh button is clicked', async () => {
      // Mock initial response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { message: 'Initial message' }
        }),
      });

      render(<HelloWorld />);

      await waitFor(() => {
        expect(screen.getByText('Initial message')).toBeInTheDocument();
      });

      // Mock second response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { message: 'Refreshed message' }
        }),
      });

      // Click refresh button
      const refreshButton = screen.getByText('Refresh Message');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByText('Refreshed message')).toBeInTheDocument();
      });

      // Should increment request count
      expect(screen.getByText('Requests made: 2')).toBeInTheDocument();
    });

    it('resets to fallback when reset button is clicked', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { message: 'API message' }
        }),
      });

      render(<HelloWorld fallbackMessage="Reset message" />);

      await waitFor(() => {
        expect(screen.getByText('API message')).toBeInTheDocument();
      });

      // Click reset button
      const resetButton = screen.getByText('Reset to Fallback');
      fireEvent.click(resetButton);

      expect(screen.getByText('Reset message')).toBeInTheDocument();
      expect(screen.queryByText(/API Error/)).not.toBeInTheDocument();
    });

    it('disables buttons during loading', async () => {
      // Mock slow API response
      fetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: { message: 'Delayed message' }
          }),
        }), 100))
      );

      render(<HelloWorld />);

      // Buttons should be disabled during initial load
      expect(screen.getByText('Refresh Message')).toBeDisabled();
      expect(screen.getByText('Reset to Fallback')).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByText('Delayed message')).toBeInTheDocument();
      });

      // Buttons should be enabled after load
      expect(screen.getByText('Refresh Message')).not.toBeDisabled();
      expect(screen.getByText('Reset to Fallback')).not.toBeDisabled();
    });
  });

  describe('PropTypes and Default Props', () => {
    it('uses default props when none provided', async () => {
      fetch.mockRejectedValueOnce(new Error('API error'));

      render(<HelloWorld />);

      await waitFor(() => {
        expect(screen.getByText('Hello, World!')).toBeInTheDocument();
      });

      expect(fetch).toHaveBeenCalledWith('/api/hello');
    });

    it('accepts custom fallback message', async () => {
      fetch.mockRejectedValueOnce(new Error('API error'));

      render(<HelloWorld fallbackMessage="Custom fallback!" />);

      await waitFor(() => {
        expect(screen.getByText('Custom fallback!')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { message: 'Hello, World!' }
        }),
      });

      render(<HelloWorld />);

      await waitFor(() => {
        expect(screen.getByText('Hello, World!')).toBeInTheDocument();
      });

      // Check for button accessibility
      const refreshButton = screen.getByRole('button', { name: /refresh message/i });
      const resetButton = screen.getByRole('button', { name: /reset to fallback/i });
      
      expect(refreshButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();
    });
  });
});