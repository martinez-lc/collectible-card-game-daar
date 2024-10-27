import express, {Request, Response, Router} from 'express';
import * as main from "../contract";

const collectionsRouter: Router = express.Router();

async function getCollections() {
    const contract = await main.init(); 
    const collections = await contract.getCollectionsWithCards(); 

    
       
    return collections.map((collection: any) => {
        return {
            collectionName: collection[0],
            cardCount: collection[1].toNumber(),
            cards: collection[2].map((card: any) => {
                return {
                    idName: card[0],
                    imgURL: card[1],
                    cardOwner: card[2],
                    forSale: card[3],
                    price: card[4]
                        
                };
            })
        };
    })

}

collectionsRouter.get('/get', async (req: Request, res: Response) => {
    try {
        const mes = await getCollections();
        res.json(mes);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'An error occurred'});
    }
});



collectionsRouter.get('/getUserCards/:userAddress', async (req: Request, res: Response) => {
    try {
        const { userAddress } = req.params;
        const contract = await main.init();
        const userCards = await contract.getUserCards(userAddress);
        res.json(userCards.map((card: any) => ({
            collectionIndex: card.collectionIndex.toNumber(),
            tokenId: card.tokenId.toNumber(),
            name: card.name,
            imageURI: card.imageURI,
            owner: card.owner,
            price: card.price.toString(),
            forSale: card.forSale
        })));
    } catch (error) {
        console.error('Error fetching user cards:', error);
        res.status(500).json({ error: 'An error occurred while fetching user cards' });
    }
});






export default collectionsRouter;
