import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface Card {
  collectionIndex: number;
  tokenId: number;
  name: string;
  imageURI: string;
  owner: string;
  price: string;
}

const BuyCards: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/marketplace/cards');
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const buyCard = async (collectionIndex: number, tokenId: number, price: string) => {
    try {
      const response = await fetch('/api/marketplace/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionIndex, tokenId, value: price }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Card purchased successfully!');
        fetchCards(); // Refresh the list
      } else {
        alert('Failed to purchase card');
      }
    } catch (error) {
      console.error('Error buying card:', error);
      alert('An error occurred while buying the card');
    }
  };

  return (
    <div>
      <h2>Available Cards</h2>
      <div className="card-grid">
        {cards.map((card) => (
          <div key={`${card.collectionIndex}-${card.tokenId}`} className="card">
            <img src={card.imageURI} alt={card.name} />
            <h3>{card.name}</h3>
            <p>Price: {ethers.utils.formatEther(card.price)} ETH</p>
            <p>Owner: {card.owner}</p>
            <button onClick={() => buyCard(card.collectionIndex, card.tokenId, card.price)}>
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCards;
