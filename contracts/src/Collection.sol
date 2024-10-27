// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";


contract Collection is ERC721 {
    uint256 private _tokenIdCounter;

    string public nameC;
    address public owner;
    uint256 public cardCount;
    uint256 public cardPrice = 0 ether;

    struct Card {
        string name;
        string imageURI;
        address owner;
        bool forSale;
        uint256 price;
    }

    mapping(uint256 => Card) private _cards;

    constructor(string memory _name, uint256 _cardCount, address _owner)ERC721(_name, "MYNFT") {
        nameC = _name;
        cardCount = _cardCount;
        owner = _owner;
    }

    function mint(address to, string memory name, string memory imageURI) public {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _cards[tokenId] = Card(name, imageURI, to, true, cardPrice);
    }

    

    function getCard(uint256 tokenId) public view returns (Card memory) {
        return _cards[tokenId];
    }


    // Returns all cards in the collection
    function getAllCards() public view returns (Card[] memory) {
        Card[] memory cardsArray = new Card[](_tokenIdCounter);
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            cardsArray[i] = _cards[i];
        }
        return cardsArray;
    }


    //Marketplace cards

    function setForSale(uint256 tokenId) public {
        //require(ownerOf(tokenId) == msg.sender, "Not the owner");
        _cards[tokenId].forSale = true;
        //_cards[tokenId].price = price;
    }

    function removeFromSale(uint256 tokenId) public {
        //require(ownerOf(tokenId) == msg.sender, "Not the owner");
        _cards[tokenId].forSale = false;
        //_cards[tokenId].price = 0;
    }


    function buyCardCollection(uint256 tokenId, address buyer, uint256 price) public payable {
        Card storage cardS = _cards[tokenId];
        require(cardS.forSale, "Card not for sale");
        require(msg.value >= cardS.price, "Insufficient payment");
        address seller = cardS.owner;
        //approve(address(this), tokenId);

        // Transfer the token
        console.log("vendedor",seller);
        console.log(tokenId);
        _transfer(seller, buyer, tokenId);

        // Update card ownership and status
        cardS.owner = buyer;
        cardS.forSale = false;
        cardS.price = 0;
        // Transfer funds to the seller
        //seller.transfer(price);

        emit CardSold(tokenId, seller, buyer, price);
    }


    event CardSold(uint256 tokenId, address seller, address buyer, uint256 price);


}