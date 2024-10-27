// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract Main is Ownable {
    mapping(uint256 => Collection) public _collections;
    uint256 private _collectionCount;
    
    // Struct to encapsulate collection info
    struct CollectionInfo {
        string name;
        uint256 cardCount;
        Collection.Card[] cards;
    }

    struct MarketplaceCard {
        uint256 collectionIndex;
        uint256 tokenId;
        string name;
        string imageURI;
        address owner;
        uint256 price;
        bool forSale;
    }

    constructor() {
        _collectionCount = 0;

    }
    
    fallback() external {
        revert("Function not recognized");
    }

    function createCollection(string memory name, uint256 cardCount) external onlyOwner {
        //require(msg.sender == address(this), "Only the owner can create collections");
        Collection collection = new Collection(name, cardCount, address(this));
        _collections[_collectionCount] = collection;
        _collectionCount++;
    }

    function mintCardToUser(uint256 collectionIndex, address to, string memory name, string memory imageURI) public onlyOwner{
        //require(msg.sender == address(this), "Only the owner can mint cards");
        Collection collection = _collections[collectionIndex];
        collection.mint(to, name, imageURI);
    }


    function getCollection(uint256 collectionIndex) public view returns (Collection) {
        return _collections[collectionIndex];
    }

    function getCollectionCount() public view returns (uint256) {
        return _collectionCount;
    }


    // Modified function to return collections and their associated cards
    function getCollectionsWithCards() public view returns (CollectionInfo[] memory) {
        CollectionInfo[] memory collectionInfos = new CollectionInfo[](_collectionCount);

        for (uint256 i = 0; i < _collectionCount; i++) {
            Collection collection = _collections[i];
            string memory collectionName = collection.nameC();
            uint256 cardCount = collection.cardCount();
            Collection.Card[] memory cards = collection.getAllCards();

            collectionInfos[i] = CollectionInfo({
                name: collectionName,
                cardCount: cardCount,
                cards: cards
            });
        }

        return collectionInfos;
    }

    
    // Fuctions Marketplace Cards

    function setCardForSale(uint256 collectionIndex, uint256 tokenId) public {
        Collection collection = _collections[collectionIndex];
        collection.setForSale(tokenId);
    }

    function removeCardFromSale(uint256 collectionIndex, uint256 tokenId) public {
        Collection collection = _collections[collectionIndex];
        collection.removeFromSale(tokenId);
    }

    function buyCard(uint256 collectionIndex, uint256 tokenId) public payable {
        console.log("bien por aeui ", msg.value);
        console.log("bien por aeui ", msg.sender);
        Collection collection = _collections[collectionIndex];
        collection.buyCardCollection(tokenId, msg.sender, msg.value);
        emit CardPurchased(collectionIndex, tokenId, msg.sender, msg.value);
    }

    event CardPurchased(uint256 collectionIndex, uint256 tokenId, address buyer, uint256 price);





    function getMarketplaceCards() public view returns (MarketplaceCard[] memory) {
        console.log("Starting getMarketplaceCards function");
        uint256 totalCards = 0;
        for (uint256 i = 0; i < _collectionCount; i++) {
            totalCards += _collections[i].cardCount();
        }
        console.log("Total cards:", totalCards);

        MarketplaceCard[] memory marketplaceCards = new MarketplaceCard[](totalCards);
        uint256 cardIndex = 0;

        for (uint256 i = 0; i < _collectionCount; i++) {
            Collection collection = _collections[i];
            Collection.Card[] memory cards = collection.getAllCards();
            
            for (uint256 j = 0; j < cards.length; j++) {
                if (cards[j].forSale) {
                    marketplaceCards[cardIndex] = MarketplaceCard({
                        collectionIndex: i,
                        tokenId: j,
                        name: cards[j].name,
                        imageURI: cards[j].imageURI,
                        owner: cards[j].owner,
                        price: cards[j].price,
                        forSale: cards[j].forSale
                    });
                    cardIndex++;
                }
            }
        }

        console.log("Total marketplace cards:", cardIndex);

        assembly {
            mstore(marketplaceCards, cardIndex)
        }

        return marketplaceCards;
    }

    function getUserCards(address user) public view returns (MarketplaceCard[] memory) {
        console.log("cartas por usuario: ", user);
        uint256 totalCards = 0;
        for (uint256 i = 0; i < _collectionCount; i++) {
            totalCards += _collections[i].balanceOf(user);
        }

        MarketplaceCard[] memory userCards = new MarketplaceCard[](totalCards);
        uint256 cardIndex = 0;

        for (uint256 i = 0; i < _collectionCount; i++) {
            Collection collection = _collections[i];
            Collection.Card[] memory cards = collection.getAllCards();
            
            for (uint256 j = 0; j < cards.length; j++) {
                if (cards[j].owner == user) {
                    userCards[cardIndex] = MarketplaceCard({
                        collectionIndex: i,
                        tokenId: j,
                        name: cards[j].name,
                        imageURI: cards[j].imageURI,
                        owner: cards[j].owner,
                        price: cards[j].price,
                        forSale: cards[j].forSale
                    });
                    cardIndex++;
                }
            }
        }

        assembly {
            mstore(userCards, cardIndex)
        }

        return userCards;
    }




    
}
