import 'dotenv/config'
import {DeployFunction} from 'hardhat-deploy/types'
import {ethers} from 'hardhat'

const deployer: DeployFunction = async hre => {
    const {deploy, getDeploymentsFromAddress} = hre.deployments;
    if (hre.network.config.chainId !== 31337) return
    const {deployer, second, random} = await hre.getNamedAccounts()
    // await deploy('Collection', {from: deployer, log: true, gasLimit: 30000000 });
    const mainDeployment = await deploy('Main', {
        from: deployer,
        log: true,
        gasLimit: 8000000
    });

    console.log("Main contract deployed to:", mainDeployment.address);
    const mainContract = await ethers.getContractAt('Main', mainDeployment.address);

    // Define collection names and split data for two collections
    let collectionName1 = "Pokemon Collection 1";
    let collectionName2 = "Pokemon Collection 2";
    let cardCount1 = 20;
    let cardCount2 = 20;


    //Create both collections
    await mainContract.createCollection(collectionName1, cardCount1);
    await mainContract.createCollection(collectionName2, cardCount2);

    // Define cards and IDs for each collection
    let cardsCollection1 = [
        { id: "dp3-1", imageUrl: "https://images.pokemontcg.io/dp3/1.png" },
        { id: "ex12-1", imageUrl: "https://images.pokemontcg.io/ex12/1.png" },
        { id: "mcd19-1", imageUrl: "https://images.pokemontcg.io/mcd19/1.png" },
        { id: "ex7-1", imageUrl: "https://images.pokemontcg.io/ex7/1.png" },
        { id: "sm9-1", imageUrl: "https://images.pokemontcg.io/sm9/1.png" },
        { id: "pl1-2", imageUrl: "https://images.pokemontcg.io/pl1/2.png" },
        { id: "ex3-2", imageUrl: "https://images.pokemontcg.io/ex3/2.png" },
        { id: "sm9-2", imageUrl: "https://images.pokemontcg.io/sm9/2.png" },
        { id: "mcd19-2", imageUrl: "https://images.pokemontcg.io/mcd19/2.png" },
        { id: "xy5-2", imageUrl: "https://images.pokemontcg.io/xy5/2.png" },
        { id: "sm12-1", imageUrl: "https://images.pokemontcg.io/sm12/1.png" },
        { id: "si1-1", imageUrl: "https://images.pokemontcg.io/si1/1.png" },
        { id: "sm3-1", imageUrl: "https://images.pokemontcg.io/sm3/1.png" },
        { id: "pop7-1", imageUrl: "https://images.pokemontcg.io/pop7/1.png" },
        { id: "bw1-2", imageUrl: "https://images.pokemontcg.io/bw1/2.png" },
        { id: "base4-3", imageUrl: "https://images.pokemontcg.io/base4/3.png" },
        { id: "hgss4-3", imageUrl: "https://images.pokemontcg.io/hgss4/3.png" },
        { id: "ex7-3", imageUrl: "https://images.pokemontcg.io/ex7/3.png" },
        { id: "swsh35-2", imageUrl: "https://images.pokemontcg.io/swsh35/2.png" },
        { id: "xy2-3", imageUrl: "https://images.pokemontcg.io/xy2/3.png" }
    ];

    let cardsCollection2 = [
        { id: "sm9-3", imageUrl: "https://images.pokemontcg.io/sm9/3.png" },
        { id: "sm1-2", imageUrl: "https://images.pokemontcg.io/sm1/2.png" },
        { id: "mcd19-3", imageUrl: "https://images.pokemontcg.io/mcd19/3.png" },
        { id: "dp3-3", imageUrl: "https://images.pokemontcg.io/dp3/3.png" },
        { id: "base1-1", imageUrl: "https://images.pokemontcg.io/base1/1.png" },
        { id: "ex8-1", imageUrl: "https://images.pokemontcg.io/ex8/1.png" },
        { id: "pop5-1", imageUrl: "https://images.pokemontcg.io/pop5/1.png" },
        { id: "xy10-1", imageUrl: "https://images.pokemontcg.io/xy10/1.png" },
        { id: "ecard2-H1", imageUrl: "https://images.pokemontcg.io/ecard2/H1.png" },
        { id: "base4-1", imageUrl: "https://images.pokemontcg.io/base4/1.png" },
        { id: "ex11-1", imageUrl: "https://images.pokemontcg.io/ex11/1.png" },
        { id: "base3-2", imageUrl: "https://images.pokemontcg.io/base3/2.png" },
        { id: "gym1-2", imageUrl: "https://images.pokemontcg.io/gym1/2.png" },
        { id: "ex14-1", imageUrl: "https://images.pokemontcg.io/ex14/1.png" },
        { id: "sm115-1", imageUrl: "https://images.pokemontcg.io/sm115/1.png" },
        { id: "col1-1", imageUrl: "https://images.pokemontcg.io/col1/1.png" },
        { id: "ex9-1", imageUrl: "https://images.pokemontcg.io/ex9/1.png" },
        { id: "bw10-1", imageUrl: "https://images.pokemontcg.io/bw10/1.png" },
        { id: "ex9-2", imageUrl: "https://images.pokemontcg.io/ex9/2.png" },
        { id: "ru1-3", imageUrl: "https://images.pokemontcg.io/ru1/3.png" }
    ];

    //  Mint cards for each collection
    for (let i = 0; i < cardCount1; i++) {
        const { id, imageUrl } = cardsCollection1[i];
        await mainContract.mintCardToUser(0, deployer, id, imageUrl);
    }

    for (let i = 0; i < cardCount2; i++) {
        const { id, imageUrl } = cardsCollection2[i];
        await mainContract.mintCardToUser(1, deployer, id, imageUrl);
    }


}

export default deployer
