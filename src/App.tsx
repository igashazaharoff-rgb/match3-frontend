import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://yourdomain.com/tonconnect-manifest.json">
      <GameBoard />
    </TonConnectUIProvider>
  );
}

export default App;
