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
const boosterImages_1 = require("../boosterImages");
const boostersRouter = express_1.default.Router();
function getBoosterCards() {
    const copyArr = [...boosterImages_1.img];
    // Fisher-Yates shuffle to randomize the array
    for (let i = copyArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copyArr[i], copyArr[j]] = [copyArr[j], copyArr[i]];
    }
    return copyArr.slice(0, 5);
}
async function getBoosters(user) {
    const contract = await main.init();
    // Now you can use the contract_ object for interactions.
    const boosters = await contract.getCollectionsAndCards(false, true, user);
    return boosters.filter((collection) => collection.owner === user)
        .map((collection) => {
        return {
            boosterId: collection[0].toNumber(),
            boosterName: collection[1] + "-" + collection[0].toNumber(),
            boosterCardCount: collection[2],
            cards: collection[3].map((card) => {
                return {
                    img: card[0],
                    cardNumber: card[1].toNumber(),
                    cardGid: card[2].toNumber(),
                    onSell: card[3],
                    cardOwner: card[4]
                };
            }),
            redeemed: collection[4],
            owner: collection[5]
        };
    });
}
boostersRouter.get('/get/:address', async (req, res) => {
    const user = req.params.address;
    try {
        const mes = await getBoosters(user);
        res.json(mes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
boostersRouter.get('/redeem', (req, res) => {
    try {
        const mes = getBoosterCards();
        res.json(mes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
exports.default = boostersRouter;
