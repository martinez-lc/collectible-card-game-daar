import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import '../css/UserCards.css';

interface Card {
  collectionIndex: number;
  tokenId: number;
  name: string;
  imageURI: string;
  owner: string;
  price: string;
  forSale: boolean; // Añadido atributo forSale
}

interface Props {
  wallet: any;
}

const UserCards: React.FC<Props> = ({ wallet }) => {
  const [cards, setCards] = useState<Card[]>([]);
  
  useEffect(() => {
    if (wallet?.details.account) {
      fetchUserCards();
    }
  }, [wallet]);

  const fetchUserCards = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/collections/getUserCards/${wallet.details.account}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user cards');
      }
      const data = await response.json();
      console.log('Fetched user cards:', data); 
      setCards(data);
    } catch (error) {
      console.error('Error fetching user cards:', error);
    }
  };

  const sellCard = async (collectionId: number, tokenId: number) => {
    if (wallet?.contract) {
      try {
        const sell = await wallet.contract.setCardForSale(collectionId, tokenId);
        await sell.wait();
        fetchUserCards(); 
      } catch (error) {
        console.error('Error selling card:', error);
      }
    }
  };

  const cancelSale = async (collectionId: number, tokenId: number) => {
    if (wallet?.contract) {
      try {
        const cancel = await wallet.contract.removeCardFromSale(collectionId, tokenId);
        await cancel.wait();
        fetchUserCards(); 
      } catch (error) {
        console.error('Error cancelling sale:', error);
      }
    }
  };

  return (
    <div className="user-cards">
      <div className="userCard-grid">
          {cards.map((card) => (
              <div key={`${card.collectionIndex}-${card.tokenId}`} className="userCard">
                  <img src={card.imageURI} alt={card.name} />
                  <h3>{card.name}</h3>
                  <p>Owner: {card.owner}</p>
                  {card.forSale ? (
                      <button 
                          className="cancel-sale" 
                          onClick={() => cancelSale(card.collectionIndex, card.tokenId)}
                      >
                          Cancel Sale
                      </button>
                  ) : (
                      <button 
                          onClick={() => sellCard(card.collectionIndex, card.tokenId)}
                      >
                          Sell
                      </button>
                  )}
              </div>
          ))}
      </div>
  </div>

  );
};

export default UserCards;
