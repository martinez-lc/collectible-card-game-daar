"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const collections_1 = __importDefault(require("./routes/collections"));
const cors_1 = __importDefault(require("cors"));
const card_1 = __importDefault(require("./routes/card"));
const booster_1 = __importDefault(require("./routes/booster"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/collections', collections_1.default);
app.use('/api/cards', card_1.default);
app.use('/api/boosters', booster_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
