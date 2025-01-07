const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AssetMartModule", (m) => {
  const assetMartContract = m.contract("AssetMart");

  return { assetMartContract };
});
