const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  console.log("Token Address", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
