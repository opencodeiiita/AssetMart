const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssetMart - getAllNFTs", function () {
    let assetMart;
    let owner;
    let addr1;
    let addr2;
    
    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2] = await ethers.getSigners();
        
        // Deploy contract
        const AssetMart = await ethers.getContractFactory("AssetMart");
        assetMart = await AssetMart.deploy();
        await assetMart.deployed();
        
        // Setup: Create some NFTs for testing
        const tokenURI = "https://example.com/token/";
        const listingPrice = ethers.utils.parseEther("1.0");
        const fee = ethers.utils.parseEther("0.01");
        
        // Create 3 NFTs with different states
        await assetMart.connect(addr1).createToken(
            tokenURI + "1",
            listingPrice,
            { value: fee }
        );
        
        await assetMart.connect(addr2).createToken(
            tokenURI + "2",
            listingPrice,
            { value: fee }
        );
        
        await assetMart.connect(addr1).createToken(
            tokenURI + "3",
            listingPrice,
            { value: fee }
        );
    });
    
    it("should return empty array when no NFTs are listed", async function () {
        // Deploy fresh contract
        const AssetMart = await ethers.getContractFactory("AssetMart");
        const freshContract = await AssetMart.deploy();
        await freshContract.deployed();
        
        const listedNFTs = await freshContract.getAllNFTs();
        expect(listedNFTs.length).to.equal(0);
    });
    
    it("should return all active listings", async function () {
        const listedNFTs = await assetMart.getAllNFTs();
        
        // Check number of listings
        expect(listedNFTs.length).to.equal(3);
        
        // Verify each listing's properties
        for (let i = 0; i < listedNFTs.length; i++) {
            expect(listedNFTs[i].listed).to.be.true;
            expect(listedNFTs[i].price).to.equal(ethers.utils.parseEther("1.0"));
            expect(listedNFTs[i].owner).to.equal(assetMart.address);
        }
        
        // Verify specific seller addresses
        expect(listedNFTs[0].seller).to.equal(addr1.address);
        expect(listedNFTs[1].seller).to.equal(addr2.address);
        expect(listedNFTs[2].seller).to.equal(addr1.address);
    });
    
    it("should only return active listings when some NFTs are unlisted", async function () {
        // Unlist one NFT (assuming there's an unlistToken function)
        await assetMart.connect(addr1).unlistToken(1);
        
        const listedNFTs = await assetMart.getAllNFTs();
        
        // Check that only listed NFTs are returned
        expect(listedNFTs.length).to.equal(2);
        
        // Verify remaining listings are still active
        for (const nft of listedNFTs) {
            expect(nft.listed).to.be.true;
        }
    });
    
    it("should handle large numbers of NFTs efficiently", async function () {
        // Create 10 more NFTs
        const fee = ethers.utils.parseEther("0.01");
        for (let i = 0; i < 10; i++) {
            await assetMart.connect(addr1).createToken(
                `https://example.com/token/${i + 4}`,
                ethers.utils.parseEther("1.0"),
                { value: fee }
            );
        }
        
        const listedNFTs = await assetMart.getAllNFTs();
        expect(listedNFTs.length).to.equal(13); // 3 original + 10 new
    });
});
