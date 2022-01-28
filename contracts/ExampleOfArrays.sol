// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract VariableExamples {
    uint256[1] public fixedArray; // Fixed array of length 1 and type uint
    uint256[] public dynamicArray; // Dynamic array of changin size

    // mapping(string => bool)
    // struct Car { string model; uint value }

    constructor() {
        dynamicArray.push(1);
        dynamicArray.push(10);
        dynamicArray.push(30);
    }

    function returnWholeArray() public view returns (uint256[] memory) {
        // We actually cannot get the whole array by calling the hidden myArray function
        // So we would have to create this function
        return dynamicArray;
    }

    function getArrayLength() public view returns (uint256) {
        return dynamicArray.length;
    }

    function getFirstElement() public view returns (uint256) {
        return dynamicArray[0];
    }
}
