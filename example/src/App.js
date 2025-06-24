import React from 'react';
import HelloWorld from './components/HelloWorld';
import './App.css';

/**
 * Main application component
 * Demonstrates best practices for React application structure
 */
const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Claude Code Best Practices Demo</h1>
        <p>A Hello World application showcasing optimal AI-assisted development patterns</p>
      </header>
      
      <main className="app-main">
        <HelloWorld />
      </main>
      
      <footer className="app-footer">
        <p>
          Built with React + Node.js | Demonstrates INSTRUCTIONS.md and PROMPTS.md patterns
        </p>
      </footer>
    </div>
  );
};

export default App;