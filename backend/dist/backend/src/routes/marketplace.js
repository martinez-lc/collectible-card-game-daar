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
const marketplaceRouter = express_1.default.Router();
async function getMarketplaceCards() {
    try {
        const contract = await main.init();
        const marketplaceCards = await contract.getMarketplaceCards();
        //console.log('Raw marketplace cards:', marketplaceCards);
        if (!marketplaceCards || marketplaceCards.length === 0) {
            console.log('No marketplace cards found');
            return [];
        }
        return marketplaceCards.map((card) => {
            //console.log('Processing card:', card);
            return {
                collectionIndex: card.collectionIndex.toNumber(),
                tokenId: card.tokenId.toNumber(),
                name: card.name,
                imageURI: card.imageURI,
                owner: card.owner,
                price: card.price.toString()
            };
        });
    }
    catch (error) {
        console.error('Error in getMarketplaceCards:', error);
        throw error;
    }
}
marketplaceRouter.get('/cards', async (req, res) => {
    try {
        const cards = await getMarketplaceCards();
        res.json(cards);
    }
    catch (error) {
        console.error('Error fetching marketplace cards:', error);
        res.status(500).json({ error: 'An error occurred while fetching marketplace cards' });
    }
});
marketplaceRouter.post('/setForSale', async (req, res) => {
    try {
        const { collectionIndex, tokenId, price } = req.body;
        const contract = await main.init();
        await contract.setCardForSale(collectionIndex, tokenId, price);
        res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
marketplaceRouter.post('/removeFromSale', async (req, res) => {
    try {
        const { collectionIndex, tokenId } = req.body;
        const contract = await main.init();
        await contract.removeCardFromSale(collectionIndex, tokenId);
        res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
marketplaceRouter.post('/buy', async (req, res) => {
    var _a;
    try {
        const { collectionIndex, tokenId, value } = req.body;
        const contract = await main.init();
        const tx = await contract.buyCard(collectionIndex, tokenId, { value });
        const receipt = await tx.wait();
        await contract.buyCard(collectionIndex, tokenId, { value });
        const event = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.find(e => e.event === 'CardPurchased');
        if (event && event.args) {
            res.json({
                success: true,
                transaction: tx.hash,
                buyer: event.args.buyer,
                price: event.args.price.toString()
            });
        }
        else {
            res.json({ success: true, transaction: tx.hash });
        }
    }
    catch (error) {
        console.error('Error buying card:', error);
        res.status(500).json({ error: 'An error occurred while buying the card' });
    }
});
exports.default = marketplaceRouter;
