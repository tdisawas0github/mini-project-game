import React from 'react';
import Game from './components/Game';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <Game />
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
