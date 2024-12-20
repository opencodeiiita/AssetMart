import React from 'react';
import NftTile from '../components/NftTile';

const sampleNFTs = [
  {
    id: 1,
    image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/03cb35115094373.604958457214b.jpg',
    name: 'Abstract Dream',
    description: 'A colorful abstract dream NFT.',
  },
  {
    id: 2,
    image: 'https://images.wsj.net/im-491399?width=700&height=700',
    name: 'Bored Ape',
    description: 'A beautiful ape NFT',
  },
  {
    id: 3,
    image: 'https://pics.craiyon.com/2023-08-04/fcaee37e04c14b2687e95b2b2ddf9610.webp',
    name: 'Cyberpunk Warrior',
    description: 'A futuristic cyberpunk NFT.',
  }
];

const Marketplace = () => {
  return (
    <div style={{ padding: '2rem', background: '#121212' }}>
      <h1 style={{ textAlign: 'center', color: '#00e676', marginBottom: '2rem' }}>
        NFT Marketplace
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {sampleNFTs.map((nft) => (
          <NftTile
            key={nft.id}
            image={nft.image}
            name={nft.name}
            description={nft.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
