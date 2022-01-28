// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Auction {
    address public manager;
    address[] public players;
    uint256 public priceToEnter;

    constructor() {
        manager = msg.sender; // a global object
        priceToEnter = 1 ether;
    }

    function enter() public payable {
        require(
            msg.value >= priceToEnter,
            "You haven't contributed enough Ether."
        );
        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        // a global function sha3, global variable block and now
        // we hash it, convert it to number and return it
        // this is to get sort of a random number...
        uint256 kindaRandomNumber = uint256(
            keccak256(
                abi.encodePacked(block.difficulty, block.timestamp, players)
            )
        );
        return kindaRandomNumber;
    }

    function pickWinner() public managersOnly {
        require(players.length > 0, "No players entered.");
        uint256 winner = random() % players.length;
        (bool success, ) = players[winner].call{value: address(this).balance}(
            ""
        );
        require(success, "Transfer failed.");
        players = new address[](0);
    }

    modifier managersOnly() {
        require(msg.sender == manager, "Only manager can perform this action.");
        _; // this is the thing that will get replaced by the function which uses this modifier
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}