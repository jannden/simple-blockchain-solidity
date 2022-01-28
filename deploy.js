require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledContracts = require("./compile");

const provider = new HDWalletProvider(process.env.METAMASK, process.env.INFURA);
const web3 = new Web3(provider);

const deployInbox = async () => {
  // Get accounts
  const accounts = await web3.eth.getAccounts();
  const fromAccount = accounts[0];
  console.log("Will deploy from:", fromAccount);
  // Deploy contract
  const deployedContract = await new web3.eth.Contract(
    compiledContracts.Inbox.abi
  )
    .deploy({
      data: compiledContracts.Inbox.evm.bytecode.object,
      arguments: ["Hi there!"],
    })
    .send({ gas: "1000000", from: fromAccount });
  console.log("Contract deployed to", deployedContract.options.address);
  /*
  // Get value
  let message = await deployedContract.methods.message().call();
  console.log("Initial message is", message);

  // Set a new value and get it
  // Note: setting a value costs Ether
  
  await deployedContract.methods
    .setMessage("Let me introduce myself.")
    .send({ from: fromAccount });
  message = await deployedContract.methods.message().call();
  console.log("Updated message is", message);
*/
  // Close connection
  provider.engine.stop();
};
deployInbox();
