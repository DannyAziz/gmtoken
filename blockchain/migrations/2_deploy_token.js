var GmToken = artifacts.require("GmToken");
const { address } = require("../secrets.json");
module.exports = function (deployer) {
  deployer.deploy(GmToken, "GM", "gm", address);
};
