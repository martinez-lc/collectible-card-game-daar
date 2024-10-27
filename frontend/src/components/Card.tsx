import React, {useEffect, useState} from 'react';
import '../css/Card.css';
import CardPopup from "@/components/CardPopup";
import axios from "axios"; // Import your CSS file for styling

interface CardProps {
    imageUrl: string;
    cardData: string;
    cardOwner: string;
    cardId: string;
    onSell: boolean;
    onClickSell: any;
    onClickBuy: any;
    isOwner: boolean;
    showButtons: boolean;
    owner: string;
}

interface CardInfo {
    arg1: string;
    arg2: string;
    arg3: string;
    arg4: string;
    arg5: string;
    arg6: string;
    arg7: string;
    arg8: string;
    arg10: string;
    arg11: string;
    arg12: string;
    arg13: string;
    arg14: string;

}

const Card: React.FC<CardProps> = ({
                                       imageUrl,
                                       cardData,
                                       cardOwner,
                                       onSell,
                                       onClickSell,
                                       onClickBuy,
                                       isOwner,
                                       showButtons,
                                       owner
                                   }) => {

    const [isPopupOpen, setPopupOpen] = useState(false);
    const [cardJson, setCardJson] = useState<CardInfo | null>(null);

    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    useEffect(() => {
        // Fetch data from an API using Axios
        axios.get(`http://localhost:3000/api/cards/getInfo/${cardData}`)
            .then((response) => {
                setCardJson(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);


    let classname = owner === "you" ? " owner-text-card you-owner" : "owner-text-card";
    return (
        <div className="card-block">
            <div className="card">
                <img src={imageUrl} alt="Card" className="card-image" onClick={openPopup}/>
                {cardJson && isPopupOpen && (
                    <CardPopup
                        cardImg={imageUrl}
                        cardData={cardJson}
                        onClose={closePopup}
                    />
                )}
            </div>
            {
                showButtons ?
                    onSell ? (
                        isOwner ? (<button className="cancel-button" >Cancel Sale</button>) 
                            : (<button className="buy-button" onClick={onClickBuy}> Buy </button>)
                    ) : (
                        isOwner ? (<button className="sell-button" onClick={onClickSell}> Sell </button>) : (
                            <div></div>)
                    )
                    : (<div className={classname}>Owner: <span>{cardOwner}</span></div>)
            }

        </div>

    );
};

export default Card;
