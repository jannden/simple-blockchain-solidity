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

/******** Deploying the Auction contract **********/

// We have several compiled contracts, so lets create a shortcut to the right one
const auctionContract = compiledContracts["Auction.sol"].Auction;

// Create an async function as blockchain calls happen asynchronously
const deployAuction = async () => {
  // Get our account address
  const accounts = await web3.eth.getAccounts();
  const managerAccount = accounts[0];

  // Deploy the contract
  console.log("The auctionContract will be deployed from:", managerAccount);
  const deployedContract = await new web3.eth.Contract(auctionContract.abi)
    .deploy({ data: auctionContract.evm.bytecode.object })
    .send({ gas: "1000000", from: managerAccount });
  console.log("Contract deployed to", deployedContract.options.address);

  // Let a bidder enter the auction
  try {
    await deployedContract.methods
      .enter()
      .send(
        {
          from: managerAccount,
          value: web3.utils.toWei("0.011", "ether"),
          gas: "1000000",
        },
        async (error, transaction) => {
          // Here I am testing different ways of catching an error
          console.log("Transaction is", transaction);
          console.log("Error is", error);
          if (error) throw error;
        }
      )
      .on("error", async function (error) {
        // Here I am testing different ways of catching an error
        throw error;
      });
  } catch (error) {
    // Here I am testing different ways of catching an error
    provider.engine.stop();
    console.log(error);
  }

  // Get the total bid amount
  const totalBidAmount = await web3.eth.getBalance(
    deployedContract.options.address
  );
  console.log("The total bid amount", totalBidAmount);

  // Get all bidders
  const allBidders = await deployedContract.methods.getPlayers().call();
  console.log("Bidders:", allBidders);

  // Get the balance of the bidder
  let bidderBalance = await web3.eth.getBalance(managerAccount);
  console.log("Bidder balance after bidding is", bidderBalance);

  // Pick a winner
  await deployedContract.methods.pickWinner().send({ from: managerAccount });
  const pastWinners = await deployedContract.methods.getPastWinners().call();
  console.log("A list of past winners contains:", pastWinners);

  bidderBalance = await web3.eth.getBalance(managerAccount);
  console.log("The new balance of the last winner is now", bidderBalance);

  // Close connection
  provider.engine.stop();
};

/******* Call the async function of choice *********/

deployAuction();
