const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssetMart", function () {
  let assetMart;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let listingPrice;

  beforeEach(async function () {
    // Deploy a new AssetMart contract before each test
    const AssetMart = await ethers.getContractFactory("AssetMart");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    assetMart = await AssetMart.deploy(); // Deploy the contract
    await assetMart.deployTransaction.wait(); // Wait for deployment to be mined
    listingPrice = await assetMart.getListPrice(); // Retrieve the listing price
  });
  

  describe("Token Creation and Listing", function () {
    // Test 1: Successfully create and list a token
    it("Should create and list a new token with correct parameters", async function () {
      const price = ethers.utils.parseEther("1");
      await assetMart.createToken("tokenURI1", price, { value: listingPrice });
      const item = await assetMart.getLatestIdToListedToken();

      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(price);
      expect(item.isListed).to.equal(true);
    });

    // Test 2: Fail when listing price is incorrect
    it("Should fail when listing price is incorrect", async function () {
      const price = ethers.utils.parseEther("1");
      const incorrectListingPrice = ethers.utils.parseEther("0.01");

      await expect(
        assetMart.createToken("tokenURI1", price, { value: incorrectListingPrice })
      ).to.be.revertedWith("Price must be equal to listing price");
    });

    // Test 3: Fail when price is zero
    it("Should fail when token price is zero", async function () {
      await expect(
        assetMart.createToken("tokenURI1", 0, { value: listingPrice })
      ).to.be.revertedWith("Price must be at least 1 wei");
    });

    // Test 4: Verify token URI is set correctly
    it("Should set token URI correctly", async function () {
      const price = ethers.utils.parseEther("1");
      const tokenURI = "ipfs://test-uri";
      await assetMart.createToken(tokenURI, price, { value: listingPrice });
      const item = await assetMart.getLatestIdToListedToken();

      expect(item.tokenURI).to.equal(tokenURI);
    });

    // Test 5: Emit correct event on token creation
    it("Should emit ListingSuccess event with correct parameters", async function () {
      const price = ethers.utils.parseEther("1");

      await expect(assetMart.createToken("tokenURI1", price, { value: listingPrice }))
        .to.emit(assetMart, "ListingSuccess")
        .withArgs(1, owner.address, assetMart.address, price, true);
    });
  });

  describe("NFT Sale Execution", function () {
    beforeEach(async function () {
      // Create a token before each test in this block
      await assetMart.connect(addr1).createToken(
        "tokenURI1",
        ethers.utils.parseEther("1"),
        { value: listingPrice }
      );
    });

    // Test 1: Successfully execute a sale
    it("Should execute sale successfully", async function () {
      const price = ethers.utils.parseEther("1");
      await expect(
        assetMart.connect(addr2).executeSale(1, { value: price })
      ).to.emit(assetMart, "SaleExecuted");
    });

    // Test 2: Fail when incorrect price is sent
    it("Should fail when incorrect price is sent", async function () {
      const incorrectPrice = ethers.utils.parseEther("0.5");
      await expect(
        assetMart.connect(addr2).executeSale(1, { value: incorrectPrice })
      ).to.be.revertedWith("Incorrect ETH amount sent");
    });

    // Test 3: Fail when NFT is not listed
    it("Should fail when NFT is not listed", async function () {
      const price = ethers.utils.parseEther("1");
      await assetMart.connect(addr2).executeSale(1, { value: price });
      
      await expect(
        assetMart.connect(addrs[0]).executeSale(1, { value: price })
      ).to.be.revertedWith("NFT is not listed for sale");
    });

    // Test 4: Prevent seller from buying their own NFT
    it("Should prevent seller from buying their own NFT", async function () {
      const price = ethers.utils.parseEther("1");
      await expect(
        assetMart.connect(addr1).executeSale(1, { value: price })
      ).to.be.revertedWith("Buyer cannot be the seller");
    });

    // Test 5: Verify ownership transfer after sale
    it("Should transfer ownership correctly after sale", async function () {
      const price = ethers.utils.parseEther("1");
      await assetMart.connect(addr2).executeSale(1, { value: price });
      const item = await assetMart.getListedTokenForId(1);
      
      expect(item.owner).to.equal(addr2.address);
      expect(item.isListed).to.equal(false);
    });
  });

  describe("NFT Listing Management", function () {
    // Test 1: Get all NFTs when none exist
    it("Should return empty array when no NFTs exist", async function () {
      const items = await assetMart.getAllNFTs();
      expect(items.length).to.equal(0);
    });

    // Test 2: Get all NFTs with multiple listings
    it("Should return all listed NFTs", async function () {
      const price = ethers.utils.parseEther("1");
      
      await assetMart.createToken("tokenURI1", price, { value: listingPrice });
      await assetMart.createToken("tokenURI2", price, { value: listingPrice });
      
      const items = await assetMart.getAllNFTs();
      expect(items.length).to.equal(2);
    });

    // Test 3: Get all NFTs after some are sold
    it("Should only return listed NFTs after sales", async function () {
      const price = ethers.utils.parseEther("1");
      
      await assetMart.createToken("tokenURI1", price, { value: listingPrice });
      await assetMart.createToken("tokenURI2", price, { value: listingPrice });
      await assetMart.connect(addr1).executeSale(1, { value: price });
      
      const items = await assetMart.getAllNFTs();
      expect(items.length).to.equal(1);
    });

    // Test 4: Verify NFT details in listing
    it("Should return correct NFT details", async function () {
      const price = ethers.utils.parseEther("1");
      const tokenURI = "ipfs://test-uri";
      
      await assetMart.createToken(tokenURI, price, { value: listingPrice });
      const items = await assetMart.getAllNFTs();
      
      expect(items[0].tokenURI).to.equal(tokenURI);
      expect(items[0].price).to.equal(price);
      expect(items[0].isListed).to.equal(true);
    });

    // Test 5: Get my NFTs functionality
    it("Should return only NFTs owned by caller", async function () {
      const price = ethers.utils.parseEther("1");
      
      // Create NFTs from different addresses
      await assetMart.connect(addr1).createToken("tokenURI1", price, { value: listingPrice });
      await assetMart.connect(addr2).createToken("tokenURI2", price, { value: listingPrice });
      
      // Buy first NFT with addr2
      await assetMart.connect(addr2).executeSale(1, { value: price });
      
      const addr2NFTs = await assetMart.connect(addr2).getMyNFTs();
      expect(addr2NFTs.length).to.equal(1);
      expect(addr2NFTs[0].tokenId).to.equal(1);
    });
  });

  describe("Contract Management", function () {
    // Test 1: Update listing price
    it("Should allow owner to update listing price", async function () {
      const newListingPrice = ethers.utils.parseEther("0.05");
      await assetMart.updateListPrice(newListingPrice);
      expect(await assetMart.getListPrice()).to.equal(newListingPrice);
    });

    // Test 2: Prevent non-owner from updating listing price
    it("Should prevent non-owner from updating listing price", async function () {
      const newListingPrice = ethers.utils.parseEther("0.05");
      await expect(
        assetMart.connect(addr1).updateListPrice(newListingPrice)
      ).to.be.revertedWith("Only contract owner can update the listing price");
    });

    // Test 3: Get current token count
    it("Should return correct token count", async function () {
      const price = ethers.utils.parseEther("1");
      
      await assetMart.createToken("tokenURI1", price, { value: listingPrice });
      await assetMart.createToken("tokenURI2", price, { value: listingPrice });
      
      expect(await assetMart.getCurrentToken()).to.equal(2);
    });

    // Test 4: Get listed token for invalid ID
    it("Should revert when getting non-existent token", async function () {
      await expect(
        assetMart.getListedTokenForId(999)
      ).to.be.revertedWith("Token is not listed");
    });

    // Test 5: Get latest token when none exist
    it("Should revert when getting latest token with no tokens", async function () {
      await expect(
        assetMart.getLatestIdToListedToken()
      ).to.be.revertedWith("No tokens have been created yet");
    });
  });
});