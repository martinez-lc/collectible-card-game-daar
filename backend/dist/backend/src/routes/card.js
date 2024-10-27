"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const cardsR = express_1.default.Router();
// Route to get card information by token ID 
cardsR.get('/getInfo/:tokenId', async (req, res) => {
    const idCard = req.params.tokenId;
    const apiUrl = `https://api.pokemontcg.io/v2/cards/${idCard}`;
    //const apiUrl = `https://api.pokemontcg.io/v2/cards/hgss4-1`;
    try {
        const response = await (0, node_fetch_1.default)(apiUrl);
        if (response.ok) {
            const jsonData = await response.json();
            if (jsonData && jsonData.data) {
                res.json(jsonData.data);
            }
            else {
                res.status(404).json({ error: 'Card not found' });
            }
        }
        else {
            console.error('Failed to fetch JSON data:', response.statusText);
            res.status(response.status).json({ error: response.statusText });
        }
    }
    catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
exports.default = cardsR;
