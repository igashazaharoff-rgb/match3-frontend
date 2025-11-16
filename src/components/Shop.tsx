tsx
import React from 'react';

const shopItems = [
  { id: 'energy', name: '+5 энергии', price: 100, type: 'energy' },
  { id: 'skin1', name: 'Скин: Огонь', price: 500, type: 'skin' },
  { id: 'boost', name: 'Удвоитель очков', price: 300, type: 'boost' },
];

const Shop = ({ coins, buyItem }: { coins: number; buyItem: (id: string) => void }) => {
  return (
    <div className="shop">
      <h3>Магазин</h3>
      {shopItems.map(item => (
        <div key={item.id} className="shop-item">
          <div>{item.name}</div>
          <div>{item.price} монет</div>
          <button
            onClick={() => buyItem(item.id)}
            disabled={coins < item.price}
          >
            Купить
          </button>
        </div>
      ))}
    </div>
  );
};

export default Shop;
