const fs = require('fs');
const path = require('path');
const { uploadFileToIPFS, uploadJSONToIPFS } = require('./pinata');

(async () => {
    try {

        // Test image upload
        const imagePath = path.join(__dirname, 'example.jpg');
        const imageBuffer = fs.readFileSync(imagePath);
        const imageUrl = await uploadFileToIPFS(imageBuffer, 'example.jpg');
        console.log('Image uploaded to IPFS:', imageUrl);

        // Test JSON upload
        const metadata = {
            name: "My NFT",
            description: "This is a test NFT",
            image: imageUrl,
        };
        const metadataUrl = await uploadJSONToIPFS(metadata);
        console.log('Metadata uploaded to IPFS:', metadataUrl);

    } 
    catch (error) {
        console.error('Test failed:', error.message);
    }
})();
