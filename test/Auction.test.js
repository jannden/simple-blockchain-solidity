const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledContracts = require("../compile");
const auctionContract = compiledContracts["Auction.sol"].Auction;

let auction;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  auction = await new web3.eth.Contract(auctionContract.abi)
    .deploy({
      data: auctionContract.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "30000000" });
});

describe("Auction Contract", () => {
  it("deployes a contract", () => {
    assert.ok(auction.options.address);
  });
  it("allows a new buyer to enter the auction", async () => {
    await auction.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") });
    const players = await auction.methods.getPlayers().call();
    assert.strictEqual(players[0], accounts[0]);
    assert.strictEqual(players.length, 1);
  });
  it("requires a minimum amount of ether to enter", async () => {
    let playerAdded;
    try {
      await auction.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei("0.001", "ether"),
      });
      playerAdded = true;
    } catch (err) {
      playerAdded = false;
    }
    assert.strictEqual(playerAdded, false);
  });

  it("only manager can call pickWinner", async () => {
    let winnerWasPicked;
    try {
      await auction.methods.enter().send({
        // At least one person must enter in order to test this
        from: accounts[1],
        value: web3.utils.toWei("0.01", "ether"),
      });
      await auction.methods.pickWinner().send({
        from: accounts[1],
      });
      winnerWasPicked = true;
    } catch (err) {
      winnerWasPicked = false;
    }
    assert.strictEqual(winnerWasPicked, false);
  });
  it("sends money to the winner", async () => {
    let initialBalances = {};

    // Bidders enter the contest
    await auction.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("1", "ether"),
    });
    initialBalances = {
      ...initialBalances,
      [accounts[1]]: await web3.eth.getBalance(accounts[1]),
    };
    await auction.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("1", "ether"),
    });
    initialBalances = {
      ...initialBalances,
      [accounts[2]]: await web3.eth.getBalance(accounts[2]),
    };
    await auction.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei("1", "ether"),
    });
    initialBalances = {
      ...initialBalances,
      [accounts[3]]: await web3.eth.getBalance(accounts[3]),
    };

    // Manager requests a winner pick
    await auction.methods.pickWinner().send({
      from: accounts[0],
      gas: "30000000",
    });

    // We get the list of past winners
    const pastWinners = await auction.methods.getPastWinners().call();

    // We verify the balance of the winner increased appropriately
    const lastWinnerAddress = pastWinners[pastWinners.length - 1];
    const winnerBalance = await web3.eth.getBalance(lastWinnerAddress);
    const finalContractBalance = await web3.eth.getBalance(
      auction.options.address
    );

    // We check the before and after ballance of the winner
    // Cannot check exact balance because we don't calculate gas spending at the moment
    assert(Number(winnerBalance) > Number(initialBalances[lastWinnerAddress]));
    assert.strictEqual(Number(finalContractBalance), 0);

    // The list of players should be empty to prepare contract for another round
    const players = await auction.methods.getPlayers().call();
    assert.deepStrictEqual(players, []);
  });
});
