const SocialNetwork = artifacts.require("SocialNetwork");
// Gets the file (artifacts) from the abi.

module.exports = function(deployer) {
  deployer.deploy(SocialNetwork);
};
