require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledContracts = require("./compile");

const provider = new HDWalletProvider(process.env.METAMASK, process.env.INFURA);
const web3 = new Web3(provider);

/******** Deploying the Inbox contract **********/

// We have several compiled contracts, so lets create a shortcut to the right one
const inboxContract = compiledContracts["Inbox.sol"].Inbox;

// Create an async function as blockchain calls happen asynchronously
const deployInbox = async () => {
  // Get our account address
  const accounts = await web3.eth.getAccounts();
  const fromAccount = accounts[0];

  // Deploy contract
  console.log("The inboxContract will be deployed from:", fromAccount);
  const deployedContract = await new web3.eth.Contract(inboxContract.abi)
    .deploy({
      data: inboxContract.evm.bytecode.object,
      arguments: ["Hi there!"],
    })
    .send({ gas: "1000000", from: fromAccount });
  console.log("Contract deployed to", deployedContract.options.address);

  // Get value
  let message = await deployedContract.methods.message().call();
  console.log("Initial message is", message);

  // Set a new value and get it
  // Note: setting a value costs Ether
  await deployedContract.methods
    .setMessage("Let me introduce myself.")
    .send({ gas: "1000000", from: fromAccount });
  message = await deployedContract.methods.message().call();
  console.log("Updated message is", message);

  // Close connection
  provider.engine.stop();
};

deployInbox();
