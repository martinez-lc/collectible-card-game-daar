"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const ethers_1 = require("ethers");
const contracts_json_1 = require("../../frontend/src/contracts.json");
const init = async () => {
    const jsonRpcUrl = 'http://127.0.0.1:8545';
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(jsonRpcUrl);
    const signer = new ethers_1.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const { address, abi } = contracts_json_1.contracts.Main;
    const contract = new ethers_1.ethers.Contract(address, abi, provider);
    const deployed = await contract.deployed();
    if (!deployed)
        console.log("contract not deployed");
    const contract_ = signer ? contract.connect(signer) : contract;
    return contract_;
};
exports.init = init;
