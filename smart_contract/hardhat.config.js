//viWo5OYCgRMxC9vrzoPoLiu6KhtuRw6w
//https://eth-ropsten.alchemyapi.io/v2/viWo5OYCgRMxC9vrzoPoLiu6KhtuRw6w

//const { solidity } = require('ethereum-waffle');

require("@nomiclabs/hardhat-waffle"); //hardhat用來test的套件

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/viWo5OYCgRMxC9vrzoPoLiu6KhtuRw6w",
      accounts: [
        "e75b9555672d6d1278a5efa71e30f30ba0a55dda0e43ca0196377c4289a43cf6",
      ],
    },
  },
};
