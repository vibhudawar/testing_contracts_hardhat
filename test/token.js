const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Token Contract", function () {
  let Token;
  let hardHatToken;
  let owner;
  let add1;
  let add2;
  let add;

  //Hook provided by mocha framework (beforeEach)
  // using this, for any test, we need not to write these lines again, our code repetition will be reduced
  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, add1, add2, ...add] = await ethers.getSigners();
    hardHatToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardHatToken.owner()).to.equal(owner.address);
    });
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardHatToken.balanceOf(owner.address);
      expect(await hardHatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // owner account to add1.address
      await hardHatToken.transfer(add1.address, 5);
      const add1Balance = await hardHatToken.balanceOf(add1.address);
      expect(add1Balance).to.equal(5);

      //from add1 to add2
      await hardHatToken.connect(add1).transfer(add2.address, 5);
      const add2Balance = await hardHatToken.balanceOf(add2.address);
      expect(add2Balance).to.equal(5);
    });

    it("Should fail if the owner doesn't have sufficient balance", async function () {
      const initialOwnerBalance = await hardHatToken.balanceOf(owner.address);

      // if below statement fails then print Not enough tokens
      await expect(
        hardHatToken.connect(add1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough amount to transfer");
      expect(await hardHatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardHatToken.balanceOf(owner.address);
      await hardHatToken.transfer(add1.address, 5);
      await hardHatToken.transfer(add2.address, 10);

      const finalOwnerBalance = await hardHatToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 15); // 5 + 10 = 15

      const add1Balance = await hardHatToken.balanceOf(add1.address);
      expect(add1Balance).to.equal(5);
      const add2Balance = await hardHatToken.balanceOf(add2.address);
      expect(add2Balance).to.equal(10);
    });
  });
});
