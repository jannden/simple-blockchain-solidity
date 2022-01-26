const assert = require("assert"); // node standard library for test assertions
const ganache = require("ganache");
const Web3 = require("web3"); // make sure to import it capitalized because it's a constructor function / class

// Import ABI / interface and bytecode
const { abi, evm } = require("../compile");

// Now we create an instance of Web3, so it will be with lowercase
const web3 = new Web3(ganache.provider());

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of test accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy a contract
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: ["Hi there!"],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, "Hi there!");
  });
  it("can change the message", async () => {
    await inbox.methods.setMessage("bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, "bye");
  });
});
