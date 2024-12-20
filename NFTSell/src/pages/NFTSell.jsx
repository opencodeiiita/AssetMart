import React, { useState } from 'react';
import './NFTSell.css';

function NFTSell() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    attributes: '',
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    alert('NFT details submitted! (File upload functionality will be implemented later)');
  };

  return (
    <div className="nft-sell-container">
      <h1>Sell Your NFT</h1>
      <form className="nft-form" onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="file">Upload NFT Image</label>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">NFT Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter NFT name"
            required
          />
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter a description for your NFT"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Attributes Field */}
        <div className="form-group">
          <label htmlFor="attributes">Attributes</label>
          <input
            type="text"
            id="attributes"
            name="attributes"
            value={formData.attributes}
            onChange={handleInputChange}
            placeholder="Enter attributes (e.g., color: red, size: 10)"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Submit NFT
        </button>
      </form>
    </div>
  );
}

export default NFTSell;
