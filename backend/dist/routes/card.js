"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const apiUrl = 'https://onepiece-cardgame.dev/cards.json';
const cardRouter = express_1.default.Router();
cardRouter.get('/getInfo/:gid', async (req, res) => {
    const targetGid = req.params.gid;
    try {
        const response = await (0, node_fetch_1.default)(apiUrl);
        let mes = "";
        if (response.ok) {
            const jsonData = await response.json();
            const desiredObject = jsonData.find((item) => item.gid === targetGid);
            if (desiredObject) {
                // Object with the specified gid was found
                mes = desiredObject;
            }
        }
        else {
            console.error('Failed to fetch JSON data:', response.statusText);
        }
        res.json(mes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
exports.default = cardRouter;
