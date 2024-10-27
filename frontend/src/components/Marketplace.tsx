import React, { useEffect, useState } from 'react';
import {BigNumber, ethers} from "ethers";
import Card from "@/components/Card";



interface Props {
    wallet: any;
}


interface MarketplaceCard {
    collectionIndex: number;
    tokenId: number;
    name: string;
    imageURI: string;
    owner: string;
    price: string;
    forSale: boolean; 
}


const Marketplace: React.FC<Props> = ({ wallet }) => {
    const [cards, setCards] = useState<MarketplaceCard[]>([]);
    const [walletAddress, setWalletAddress] = useState<string>("");
    useEffect(() => {
        
        if (wallet?.details.account) {
            fetchMarketplaceCards();
            setWalletAddress(wallet.details.account)
        }
    }, [wallet]);

    
    
    const fetchMarketplaceCards = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/marketplace/cards');
            if (!response.ok) {
                throw new Error('Failed to fetch marketplace cards');
            }
            const data = await response.json();
            console.log('Fetched marketplace cards:', data); // Add this line for debugging
            setCards(data);
        } catch (error) {
            console.error('Error fetching marketplace cards:', error);
        }
    };



    const buyCard2 = async (collectionIndex: number, tokenId: number, price: string) => {
        try {
            const response = await fetch('http://localhost:3000/api/marketplace/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ collectionIndex, tokenId, value: price }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Card purchased successfully!');
                fetchMarketplaceCards();
            }
        } catch (error) {
            console.error('Error buying card:', error);
        }
    };

    const buyCard = async (collectionIndex: number, tokenId: number) => {
        const valueInWei: BigNumber = ethers.utils.parseEther("0.1");

        if (wallet?.contract) {
            const sell = await wallet.contract.buyCard(collectionIndex, tokenId, {value: valueInWei} );
            sell.wait().then(fetchMarketplaceCards)
        }

    };


    return (
        <div className="page-content">
                {cards === null ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="collection-block">
                        {cards
                            .map((item) => (
                                <Card key={item.name} imageUrl={item.imageURI}
                                      onClickSell={() => {
                                      }}
                                      onClickBuy={() => buyCard(item.collectionIndex, item.tokenId)}
                                      cardData={item.name} onSell= {true}
                                      isOwner={walletAddress === item.owner} showButtons={true}
                                      owner={item.owner.substring(0, 3) + "..." + item.owner.substring(38)}/>
                            ))
                        }
                    </div>
                )
                }
        </div>
    );
}
export default Marketplace;