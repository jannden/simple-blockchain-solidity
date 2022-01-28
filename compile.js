// Two standard library modules
const path = require("path"); // helps to build a path in order to get cross-platform compatibility
const fs = require("fs"); // to read contents of a file
const solc = require("solc"); // solidity compiler

// __dirname is a constant from Node pointing to the current working directory
// second parameter is directory, third parameter is the file we want to point to
const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const auctionPath = path.resolve(__dirname, "contracts", "Auction.sol");

// to read the contents of a file, we will use fs
const inboxSource = fs.readFileSync(inboxPath, "utf8");
const auctionSource = fs.readFileSync(auctionPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Inbox.sol": {
      content: inboxSource,
    },
    "Auction.sol": {
      content: auctionSource,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  ("Inbox.sol", "Auction.sol")
];
