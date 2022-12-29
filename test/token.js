const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Token contract", function () {
  it("Deployment should assign the totalSupply to the owner", async function () {
    //getSigners is an object and through that, we can access the accounts details
    const [owner] = await ethers.getSigners();
    console.log("Signers object", owner);

    //this helps to create the instance of our contract
    const Token = await ethers.getContractFactory("Token"); //instance contract

    //deploy the contract
    const hardhatToken = await Token.deploy(); //deploy contract

    //now we can access the owner's balance using the hardhatToken (deployed version of our contract) and calling the balanceOf function
    const ownerBalance = await hardhatToken.balanceOf(owner.address); //ownerBalance = 10,000
    console.log("Owner address", owner.address);

    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance); //totalSupply = 10,000
  });

  //"Should transfer tokens between accounts" is the title of the test
  it("Should transfer tokens between accounts", async function () {
    // getSigners is an object and through that, we can access the accounts details
    const [owner, add1, add2] = await ethers.getSigners();

    // this helps to create the instance of our contract
    const Token = await ethers.getContractFactory("Token"); // instance contract

    // deploy the contract
    const hardhatToken = await Token.deploy(); // deploy contract

    //transfer 10 tokens from owner to add1
    await hardhatToken.connect(owner).transfer(add1.address, 10);
    expect(await hardhatToken.balanceOf(add1.address)).to.equal(10); // balanceOf(add1) should be 10

    //transfer 5 tokens from add1 to add2
    await hardhatToken.connect(add1).transfer(add2.address, 5);
    expect(await hardhatToken.balanceOf(add2.address)).to.equal(5);
  });
});
