const LEAFToken = artifacts.require("./LEAFToken.sol");
const LEAFTokenSale = artifacts.require("./LEAFTokenSale.sol");

contract(LEAFTokenSale, function(accounts){

    var tokensAvailable = 15000;
    var tokenPrice = 1000000000000000;
    var numberOfTokens = 500;
    var admin = accounts[0];
    var receiver = accounts[1];

    it('deploys the contract correctly',function(){
        return LEAFToken.deployed().then(function(instance){
            tokenInstance = instance;
            return LEAFTokenSale.deployed().then(function(instance){
                tokenSaleInstance = instance;
                return tokenInstance.name()
            }).then(function(name){
                assert.equal(name,'LEAF Token','Has the token name')
                return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailable)
            }).then(function(receipt){
                return tokenInstance.balanceOf(tokenSaleInstance.address)
            }).then(function(balance){
                assert.equal(balance.toNumber(),15000,'has the token sale contract balance')
                return tokenSaleInstance.tokenPrice()
            }).then(function(price){
                assert.equal(price.toNumber(),tokenPrice,'has the token price')
                return tokenSaleInstance.buyTokens.call(25000,{from: receiver,value:1*tokenPrice})
            }).then(assert.fail).catch(function(error){
                assert(error.message.toString().indexOf('revert')>=0,'Invalid amount')
                return tokenSaleInstance.buyTokens.call(25000,{from: receiver,value:numberOfTokens*tokenPrice})
            }).then(assert.fail).catch(function(error){
                assert(error.message.toString().indexOf('revert')>=0,'Invalid value')
                return tokenSaleInstance.buyTokens(numberOfTokens,{from: receiver,value:numberOfTokens*tokenPrice})
            }).then(function(receipt){
                return tokenInstance.balanceOf(tokenSaleInstance.address)
            }).then(function(saleContractBalance){
                assert.equal(saleContractBalance.toNumber(),14500,'has the admin balance')
                return tokenInstance.balanceOf(receiver)
            }).then(function(balance){
                assert.equal(balance.toNumber(),500,'has the receiver balance')
                return tokenSaleInstance.endSale.call({from : receiver})
            }).then(assert.fail).catch(function(error){
                assert(error.message.toString().indexOf('revert')>=0,'Only admin can end the sale')
                return tokenSaleInstance.endSale({from : admin})
            }).then(function(receipt){
                return tokenInstance.balanceOf(admin)
            }).then(function(adminBalance){
                assert.equal(adminBalance.toNumber(),23500,'has the admin balance')
                return tokenInstance.balanceOf(tokenSaleInstance.address)
            }).then(function(saleContractBalance){
                assert.equal(saleContractBalance.toNumber(),0,'Sale contract balance')
            });
        });
    });
});