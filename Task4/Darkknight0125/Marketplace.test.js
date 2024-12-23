const { ethers } = require("hardhat");

async function main() {
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    console.log("Marketplace deployed to:", marketplace.address);

    // Add NFTs
    await marketplace.addNFT("metadata1", ethers.utils.parseEther("1"));
    await marketplace.addNFT("metadata2", ethers.utils.parseEther("2"));
    await marketplace.addNFT("metadata3", ethers.utils.parseEther("3"));

    // Mark NFT with ID 1 as sold
    await marketplace.markNFTSold(1);

    // Get all active NFTs
    const activeNFTs = await marketplace.getAllNFTs();
    console.log("Active NFTs:", activeNFTs);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
