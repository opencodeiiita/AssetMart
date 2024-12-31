const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');

dotenv.config();

// Placeholder for API key and secret
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

/**
 * Uploads an NFT image file to IPFS using Piñata's API.
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {string} fileName - The name of the file to upload.
 * @returns {Promise<string>} - The IPFS URL of the uploaded file.
 */
async function uploadFileToIPFS(fileBuffer, fileName) {

    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const formData = new FormData();

    formData.append('file', fileBuffer, { filename: fileName });

    try {
        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_API_SECRET,
            },
        });
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } 
    catch (error) {
        console.error('Error uploading file to IPFS:', error.message);
        throw new Error('File upload to IPFS failed.');
    }
}

/**
 * Uploads JSON metadata to IPFS using Piñata's API.
 * @param {Object} jsonObject - The JSON object to upload.
 * @returns {Promise<string>} - The IPFS URL of the uploaded JSON.
 */
async function uploadJSONToIPFS(jsonObject) {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    try {
        const response = await axios.post(url, jsonObject, {
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_API_SECRET,
            },
        });
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } 
    catch (error) {
        console.error('Error uploading JSON to IPFS:', error.message);
        throw new Error('JSON upload to IPFS failed.');
    }
}

module.exports = { uploadFileToIPFS, uploadJSONToIPFS };
