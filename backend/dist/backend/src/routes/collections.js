"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const main = __importStar(require("../contract"));
const collectionsRouter = express_1.default.Router();
async function getCollections() {
    const contract = await main.init();
    const collections = await contract.getCollectionsWithCards();
    return collections.map((collection) => {
        return {
            collectionName: collection[0],
            cardCount: collection[1].toNumber(),
            cards: collection[2].map((card) => {
                return {
                    idName: card[0],
                    imgURL: card[1],
                    cardOwner: card[2],
                    forSale: card[3],
                    price: card[4]
                };
            })
        };
    });
}
collectionsRouter.get('/get', async (req, res) => {
    try {
        const mes = await getCollections();
        res.json(mes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
collectionsRouter.get('/getUserCards/:userAddress', async (req, res) => {
    try {
        const { userAddress } = req.params;
        const contract = await main.init();
        const userCards = await contract.getUserCards(userAddress);
        res.json(userCards.map((card) => ({
            collectionIndex: card.collectionIndex.toNumber(),
            tokenId: card.tokenId.toNumber(),
            name: card.name,
            imageURI: card.imageURI,
            owner: card.owner,
            price: card.price.toString(),
            forSale: card.forSale
        })));
    }
    catch (error) {
        console.error('Error fetching user cards:', error);
        res.status(500).json({ error: 'An error occurred while fetching user cards' });
    }
});
exports.default = collectionsRouter;
