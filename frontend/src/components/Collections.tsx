import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../css/Collections.css'
import Card from "@/components/Card";

interface CollectionProps {
    wallet: any
}

interface CollectionItem {
    collectionName: string;
    cardCount: number;
    cards: CardItem[];
}

interface CardItem {
    idName: string;
    imgURL: string;
    cardOwner: string;

}

const Collections: React.FC<CollectionProps> = ({wallet}) => {
    const [collectionData, setCollectionData] = useState<CollectionItem[] | null>(null);
    const [walletAddress, setWalletAddress] = useState<string>("");
    useEffect(() => {
        if (wallet?.details.account) {
            setWalletAddress(wallet.details.account)
        }
    }, [wallet]);

    useEffect(() => {
        getCollections()
    }, []);

    const getCollections = () => {
        // Fetch data from an API using Axios
        axios.get('http://localhost:3000/api/collections/get')
            .then((response) => {
                setCollectionData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    return (
        <div className="page-content">
            {collectionData === null ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="collection">
                    <div className="collection-right">
                        {collectionData.map((item) => (
                            <div key={item.collectionName} id={`${item.collectionName}`}>
                                <div className="collection-title">
                                    <span className="collection-count">{item.cardCount}</span>
                                    <span className="collection-name">{item.collectionName} </span>
                                </div>
                                <div className="collection-block">
                                    {
                                        item.cards
                                            .filter((card) => card.imgURL)
                                            .map((card) =>
                                                (
                                                    <Card key={card.idName} imageUrl={card.imgURL}
                                                          cardData={card.idName} cardOwner={card.cardOwner}
                                                         
                                                    />
                                                )
                                            )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collections;
