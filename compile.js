// Two standard library modules
const path = require("path"); // helps to build a path in order to get cross-platform compatibility
const fs = require("fs"); // to read contents of a file
const solc = require("solc"); // solidity compiler

// __dirname is a constant from Node pointing to the current working directory
// second parameter is directory, third parameter is the file we want to point to
const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");

// to read the contents of a file, we will use fs
const source = fs.readFileSync(inboxPath, "utf8");

module.exports = solc.compile(source, 1).contracts[":Inbox"];
