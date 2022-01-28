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
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Auction Contract", () => {
  it("deployes a contract", () => {
    assert.ok(auction.options.address);
  });
});
