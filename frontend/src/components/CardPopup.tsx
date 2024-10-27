import React from 'react';
import '../css/CardPopup.css';

interface CardPopupProps {
    cardImg: string;
    cardData: CardInfo;
    onClose: () => void;
}

interface CardInfo {
    id: string;
    name: string;
    supertype: string;
    subtypes: string[];
    hp: string;
    types: string[];
    evolvesFrom?: string;
    attacks: AttackInfo[];
    weaknesses: WeaknessResistanceInfo[];
    resistances?: WeaknessResistanceInfo[];
    retreatCost?: string[];
    set: CardSetInfo;
    rarity: string;
    flavorText?: string;
    nationalPokedexNumbers: number[];
    images: CardImages;
}

interface AttackInfo {
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
}

interface WeaknessResistanceInfo {
    type: string;
    value: string;
}

interface CardSetInfo {
    name: string;
    series: string;
    releaseDate: string;
}

interface CardImages {
    small: string;
    large: string;
}

const CardPopup: React.FC<CardPopupProps> = ({ cardImg, cardData, onClose }) => {
    return (
        <div className="card-popup">
            <div className="popup-content">
                <span className="close-button" onClick={onClose}>X</span>
                <div>
                    {cardData === null ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="card-title">
                            
                            <div className="cardName">
                                {cardData.name}
                            </div>
                        </div>
                    )}

                    <div className="card-info">
                        <div className="card-info-img">
                            <img src={cardData.images.large} alt="Card"/>
                        </div>
                        <div className="backCol">
                            <div className="col2">
                                <div className="hp">
                                    <h3>HP</h3>
                                    {cardData.hp}
                                </div>
                                <div className="type">
                                    <h3>Type</h3>
                                    {cardData.types.join(', ')}
                                </div>
                            </div>
                            {cardData.evolvesFrom && (
                                <div className="evolvesFrom">
                                    <h3>Evolves From</h3>
                                    {cardData.evolvesFrom}
                                </div>
                            )}
                            <div className="attacks">
                                <h3>Attacks</h3>
                                {cardData.attacks.map((attack, index) => (
                                    <div key={index} className="attack">
                                        <strong>{attack.name}</strong>
                                        <p>Cost: {attack.cost.join(', ')}</p>
                                        <p>Damage: {attack.damage}</p>
                                        <p>{attack.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="weaknesses">
                                <h3>Weaknesses</h3>
                                {cardData.weaknesses.map((weakness, index) => (
                                    <p key={index}>{weakness.type}: {weakness.value}</p>
                                ))}
                            </div>
                            {cardData.resistances && (
                                <div className="resistances">
                                    <h3>Resistances</h3>
                                    {cardData.resistances.map((resistance, index) => (
                                        <p key={index}>{resistance.type}: {resistance.value}</p>
                                    ))}
                                </div>
                            )}
                            <div className="retreatCost">
                                <h3>Retreat Cost</h3>
                                {cardData.retreatCost ? cardData.retreatCost.join(', ') : '-'}
                            </div>
                            <div className="rarity">
                                <h3>Rarity</h3>
                                {cardData.rarity}
                            </div>
                            <div className="set-info">
                                <h3>Card Set</h3>
                                <p>{cardData.set.name} - {cardData.set.series}</p>
                                <p>Released: {cardData.set.releaseDate}</p>
                            </div>
                            {cardData.flavorText && (
                                <div className="flavor-text">
                                    <h3>Flavor Text</h3>
                                    <p>{cardData.flavorText}</p>
                                </div>
                            )}
                            <div className="pokedex-number">
                                <h3>National Pokedex Number</h3>
                                <p>{cardData.nationalPokedexNumbers.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardPopup;
