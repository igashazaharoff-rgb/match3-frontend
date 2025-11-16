tsx
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import React from 'react';

const TonConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  return (
    <div className="ton-connect">
      {wallet ? (
        <div>Подключено: {wallet.account.address.slice(0, 6)}...</div>
      ) : (
        <button onClick={() => tonConnectUI.connect()}>Подключить TON</button>
      )}
    </div>
  );
};

export default TonConnectButton;
