// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
const truffleAssert = require('truffle-assertions');
var SupplyChain = artifacts.require('SupplyChain');
var FarmerRole = artifacts.require('FarmerRole');

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "Sbrilly Hey"
    const originFarmInformation = "Albanian Valley"
    const originFarmLatitude = "-10.456987"
    const originFarmLongitude = "120.125679"
    var productID = sku + upc
    const productNotes = "Best beans for Caffee"
    const productPrice = web3.utils.toWei("1", "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // Initial Test
    it("Test that roles are correctly added to contract", async () => {
        const supplyChain = await SupplyChain.deployed()
        //truffleAssert.eventEmitted('TransferOwnership');

        var contractOwner = await supplyChain.owner();
        assert.equal(contractOwner, ownerID);

        var farmerAdded = await supplyChain.addFarmer(originFarmerID);
        truffleAssert.eventEmitted(farmerAdded, 'FarmerAdded');

        var distributorAdded = await supplyChain.addDistributor(distributorID);
        truffleAssert.eventEmitted(distributorAdded, 'DistributorAdded');

        var retailerAdded = await supplyChain.addRetailer(retailerID);
        truffleAssert.eventEmitted(retailerAdded, 'RetailerAdded');

        var consumerAdded = await supplyChain.addConsumer(consumerID);    
        truffleAssert.eventEmitted(consumerAdded, 'ConsumerAdded');
    })

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Mark an item as Harvested by calling function harvestItem()
        var event = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productID, productNotes)
        
        // Determine if the event has been emitted using `truffleAssert`
        truffleAssert.eventEmitted(event, 'Harvested');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const BufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(BufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(BufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(BufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(BufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(BufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(BufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(BufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(BufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(BufferTwo[5], 0, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')   
    })    

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed();
        
        // Mark an item as Processed by calling function processItem()
        var item = await supplyChain.processItem(upc, {from: originFarmerID});

        // Determine if the event has been emitted using `truffleAssert`
        truffleAssert.eventEmitted(item, 'Processed');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(BufferTwo[5], 1, 'Error: item State')
    })    

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Mark an item as Packed by calling function packItem()
        var item = await supplyChain.packItem(upc, {from: originFarmerID});

        // Determine if the event has been emitted using `truffleAssert`
        truffleAssert.eventEmitted(item, 'Packed');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(BufferTwo[5], 2, 'Error: item State');
    })    

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Mark an item as ForSale by calling function sellItem()
        var item = await supplyChain.sellItem(upc, productPrice, {from: originFarmerID});

        // Determine if the event has been emitted using `truffleAssert`
        truffleAssert.eventEmitted(item, 'ForSale');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(BufferTwo[4], productPrice, "Error: product price");
        assert.equal(BufferTwo[5], 3, 'Error: item State');
    })    

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Mark an item as Sold by calling function buyItem()
        var item = await supplyChain.buyItem(upc, {from: distributorID, value: productPrice});

        // Determine if the event has been emitted using `truffleAssert`
        truffleAssert.eventEmitted(item, 'Sold');
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(BufferTwo[5], 4, 'Error: item State');
        assert.equal(BufferTwo[6], distributorID, 'Error: distributor id');
    })    

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Mark an item as Shipped by calling function shipItem()
        var event = await supplyChain.shipItem(upc, {from: distributorID});

        // Determine if the event has been emitted using `truffleAssert`
        truffleAssert.eventEmitted(event, 'Shipped');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(BufferTwo[5], 5, 'Error: item State');
    })    

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Mark an item as Received by calling function receiveItem()
        var event = await supplyChain.receiveItem(upc, {from: retailerID});

        // Determine if the event has been emitted using `truffleAssert`
        truffleAssert.eventEmitted(event, 'Received');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(BufferTwo[5], 6, 'Error: item State');
    })

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Mark an item as Purchased by calling function purchaseItem()
        var event = await supplyChain.purchaseItem(upc, {from: consumerID});

        // Determine if the event has been emitted using `truffleAssert`
        truffleAssert.eventEmitted(event, 'Purchased');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(BufferTwo[5], 7, 'Error: item State');
    })    

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferOne = await supplyChain.fetchItemBufferOne.call(upc, {from: accounts[8]})
        
        // Verify the result set:
        assert.equal(BufferOne[0], sku, 'Error: item SKU')
        assert.equal(BufferOne[1], upc, 'Error: item UPC')
        assert.equal(BufferOne[2], consumerID, 'Error: ownerID')
        assert.equal(BufferOne[3], originFarmerID, 'Error: originFarmerID')
        assert.equal(BufferOne[4], originFarmName, 'Error: originFarmName')
        assert.equal(BufferOne[5], originFarmInformation, 'Error: originFarmInformation')
        assert.equal(BufferOne[6], originFarmLatitude, 'Error: originFarmLatitude')
        assert.equal(BufferOne[7], originFarmLongitude, 'Error: originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const BufferTwo = await supplyChain.fetchItemBufferTwo.call(upc, {from: accounts[7]})

        // Verify the result set:
        assert.equal(BufferTwo[0], sku, 'Error: item SKU')
        assert.equal(BufferTwo[1], upc, 'Error: item UPC')
        assert.equal(BufferTwo[2], productID, 'Error: productID')
        assert.equal(BufferTwo[3], productNotes, 'Error: originFarmerID')
        assert.equal(BufferTwo[4], productPrice, 'Error: originFarmName')
        assert.equal(BufferTwo[5], 7, 'Error: originFarmInformation') // Purchased
        assert.equal(BufferTwo[6], distributorID, 'Error: originFarmLatitude')
        assert.equal(BufferTwo[7], retailerID, 'Error: originFarmLongitude')
        assert.equal(BufferTwo[8], consumerID, 'Error: item State') // Purchased
    })
});