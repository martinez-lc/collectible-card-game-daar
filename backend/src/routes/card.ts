import express, { Request, Response, Router } from 'express';
import fetch from 'node-fetch';

const cardsR: Router = express.Router();

// Route to get card information by token ID 
cardsR.get('/getInfo/:tokenId', async (req: Request, res: Response) => {
    const idCard = req.params.tokenId;
    const apiUrl = `https://api.pokemontcg.io/v2/cards/${idCard}`;
    //const apiUrl = `https://api.pokemontcg.io/v2/cards/hgss4-1`;

    try {
        const response = await fetch(apiUrl);
        
        if (response.ok) {
            const jsonData = await response.json();
            if (jsonData && jsonData.data) {
                res.json(jsonData.data);
            } else {
                res.status(404).json({ error: 'Card not found' });
            }
        } else {
            console.error('Failed to fetch JSON data:', response.statusText);
            res.status(response.status).json({ error: response.statusText });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
export default cardsR;
