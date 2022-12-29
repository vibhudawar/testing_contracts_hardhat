//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

//To debug the smart contract:
import "hardhat/console.sol";

contract Token {
    string public name = "Hardhat Token";
    string public symbol = "HHT";
    uint256 public totalSupply = 10000;

    // variable for the owner, this define the owner
    address public owner;

    //associates all the addresses with balances they are having
    //for ex: address: 0x0123, has 3 ethers as balance, so it maps this
    // mapping is the data type, key: address, value = balance, and map name is balances
    mapping(address => uint256) balances;

    constructor() {
        // now, on key: msg.sender's address, totalSupply (as balance) will be allotted
        // since creator of the contract, must withold, all the supply
        balances[msg.sender] = totalSupply;
        // and set, owner as the msg.sender
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        //debug the contract
        console.log("**Sender balance is %s token**", balances[msg.sender]);
        console.log("**Sender is sending %s token to %s address**", amount, to);
        //first check if the owner has the sufficient amount or not
        require(
            balances[msg.sender] >= amount,
            "Not enough amount to transfer"
        );

        //if has, then deduct the amount
        balances[msg.sender] -= amount;
        // and add the amount to the other's user account
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
