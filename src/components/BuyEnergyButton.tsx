tsx
import { useTonConnectUI } from '@tonconnect/ui-react';
import React from 'react';

const BuyEnergyButton = () => {
  const [tonConnectUI] = useTonConnectUI();

  const buyEnergy = async () => {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: 'EQ...', // Адрес твоего контракта
          amount: '100000000', // 0.1 TON
        }
      ]
    };

    const result = await tonConnectUI.sendTransaction(transaction);
    console.log(result);
  };

  return (
    <button onClick={buyEnergy}>Купить 5 энергии за 0.1 TON</button>
  );
};

export default BuyEnergyButton;
