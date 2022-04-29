# Blockchain Solidity Contract examples

A simple contract created in Solidity which can be tested (Mocha), compiled (Solc), and deployed (hdwallet-provider).

## How to use

1. Create .env file and set these constants:
   - METAMASK should be set to your secret recovery phrase from Metamask. You can create a free Metamask account to get the secret recovery phrase.
   - INFURA should be set to an endpoint URL for Rinkeby API. You can create a free Infura.io account to get this URL.
2. You can run tests on the contracts with "npm run test".
3. Compile and deploy the contracts with: "npm run deploy".
