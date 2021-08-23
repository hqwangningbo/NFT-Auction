const NBToken = artifacts.require("./NBToken.sol");

module.exports = async function(deployer) {
  await deployer.deploy(NBToken, "NB Token", "NB")
  const nbTokenInstance = await NBToken.deployed()
};
