// transfer.js
async function main() {
    const [sender] = await ethers.getSigners();
    const receiverAddress = "0x06E64c80d5920772654d400340d3c65b364Ff307"; 
    const receiverAddress2 = "0xF5D37943B273F64E70705d4a0aDB91B810afa073"; 
    

    const tx = await sender.sendTransaction({
        to: receiverAddress,
        value: ethers.utils.parseEther("500.0") 
    });
    const tx2 = await sender.sendTransaction({
        to: receiverAddress2,
        value: ethers.utils.parseEther("500.0") 
    });

    await tx.wait();
    await tx2.wait();
    console.log(`ETH transfer to ${receiverAddress}: ${tx.hash}`);
    console.log(`ETH transfer to ${receiverAddress}: ${tx2.hash}`);
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
