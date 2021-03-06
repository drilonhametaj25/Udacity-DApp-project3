# Udacity-DApp-project3

## This is what i see in console from test

```ganache-cli accounts used here...
Contract Owner: accounts[0]  0x27D8D15CbC94527cAdf5eC14B69519aE23288B95
Farmer: accounts[1]  0x018C2daBef4904ECbd7118350A0c54DbeaE3549A
Distributor: accounts[2]  0xCe5144391B4aB80668965F2Cc4f2CC102380Ef0A
Retailer: accounts[3]  0x460c31107DD048e34971E57DA2F99f659Add4f02
Consumer: accounts[4]  0xD37b7B8C62BE2fdDe8dAa9816483AeBDBd356088


  Contract: SupplyChain
    √ Test that roles are correctly added to contract (1157ms)
    √ Testing smart contract function harvestItem() that allows a farmer to harvest coffee (988ms)
    √ Testing smart contract function processItem() that allows a farmer to process coffee (438ms)
    √ Testing smart contract function packItem() that allows a farmer to pack coffee (397ms)
    √ Testing smart contract function sellItem() that allows a farmer to sell coffee (459ms)
    √ Testing smart contract function buyItem() that allows a distributor to buy coffee (580ms)
    √ Testing smart contract function shipItem() that allows a distributor to ship coffee (399ms)
    √ Testing smart contract function receiveItem() that allows a retailer to mark coffee received (551ms)
    √ Testing smart contract function purchaseItem() that allows a consumer to purchase coffee (527ms)
    √ Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain (225ms)
    √ Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain (182ms)


  11 passing (6s) 
  ```

  ## Step by step
Change directory to project-6 folder and install all requisite npm packages (as listed in package.json):

```npm install```
Launch Ganache:

```ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"```

In a separate terminal window, Compile smart contracts:

```truffle compile```

Migrate smart contracts to the locally running blockchain, ganache-cli:

```truffle migrate```

Test smart contracts:

```truffle test```



In a separate terminal window, launch the DApp:

```npm run dev```


Libraries Write-up
Below are the dependencies in my packages.json file:
```
"dependencies": {
    "solidity-docgen": "^0.5.7",
    "truffle": "^5.1.51",
    "truffle-assertions": "^0.9.2",
    "truffle-hdwallet-provider": "^1.0.17",
    "web3": "^1.3.0"
  }
```

Why I used each library:

truffle: truffle is a development framework for Ethereum that makes it easy to compile, test, and migrate solidity contracts to Ethereum networks.
truffle-assertions: the assertions library for truffle has convenience functions designed for solidity assertions inside of truffle tests.
web3: run dapp


![Activity Diagram](Activity_diagram.png "Activity diagram")
![sequence Diagram](sequence_diagram.png "Sequence diagram")
![State Diagram](state_diagram.png "State diagram")
![Class Diagram](class_diagram.png "Class diagram")