import express, { Request, Response, Router } from 'express';
import * as main from "../contract";

const marketplaceRouter: Router = express.Router();


async function getMarketplaceCards() {
    try {
        const contract = await main.init();
        
        const marketplaceCards = await contract.getMarketplaceCards();
        //console.log('Raw marketplace cards:', marketplaceCards);

        if (!marketplaceCards || marketplaceCards.length === 0) {
            console.log('No marketplace cards found');
            return [];
        }

        return marketplaceCards.map((card: any) => {
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
    } catch (error) {
        console.error('Error in getMarketplaceCards:', error);
        throw error;
    }
}



marketplaceRouter.get('/cards', async (req: Request, res: Response) => {
    try {
        const cards = await getMarketplaceCards();
        res.json(cards);
    } catch (error) {
        console.error('Error fetching marketplace cards:', error);
        res.status(500).json({ error: 'An error occurred while fetching marketplace cards' });
    }
});

marketplaceRouter.post('/setForSale', async (req: Request, res: Response) => {
    try {
        const { collectionIndex, tokenId, price } = req.body;
        const contract = await main.init();
        await contract.setCardForSale(collectionIndex, tokenId, price);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

marketplaceRouter.post('/removeFromSale', async (req: Request, res: Response) => {
    try {
        const { collectionIndex, tokenId } = req.body;
        const contract = await main.init();
        await contract.removeCardFromSale(collectionIndex, tokenId);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

marketplaceRouter.post('/buy', async (req: Request, res: Response) => {
    try {
        const { collectionIndex, tokenId, value } = req.body;
        const contract = await main.init();
        const tx = await contract.buyCard(collectionIndex, tokenId, { value });
        const receipt = await tx.wait();
        await contract.buyCard(collectionIndex, tokenId, { value });
        const event = receipt.events?.find(e => e.event === 'CardPurchased');
        if (event && event.args) {
            res.json({ 
                success: true,
                transaction: tx.hash,
                buyer: event.args.buyer,
                price: event.args.price.toString()
            });
        } else {
            res.json({ success: true, transaction: tx.hash });
        }
    } catch (error) {
        console.error('Error buying card:', error);
        res.status(500).json({ error: 'An error occurred while buying the card' });
    }
});

export default marketplaceRouter;
