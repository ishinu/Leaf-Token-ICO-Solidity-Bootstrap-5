const LEAFToken = artifacts.require("./LEAFToken.sol");

contract(LEAFToken,function(accounts){

    var admin = accounts[0];

    it('initializes the contract with the correct values.',function(){
        return LEAFToken.deployed().then(function(instance){
            tokenInstance = instance
            return tokenInstance.name()
        }).then(function(name){
            assert.equal(name,'LEAF Token','has the correct name.')
            return tokenInstance.symbol()
        }).then(function(symbol){
            assert.equal(symbol,'LEAF','has the correct symbol')
            return tokenInstance.standard()
        }).then(function(standard){
            assert.equal(standard,'LEAF Token v1.0.0','has the correct standard')
            return tokenInstance.balanceOf(accounts[0])
        }).then(function(balance){
            assert.equal(balance.toNumber(),24000,'admin balance')
        });
    });

    it('transfers the token ownership',function(){
        return LEAFToken.deployed().then(function(instance){
            tokenIntance = instance;
            return tokenInstance.transfer.call(accounts[1],30000,{from:admin})
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert')>=0,'Not enough balance available!')
            return tokenInstance.transfer.call(accounts[1],1000,{from:admin})
        }).then(function(success){
            assert.equal(success,true,'Transfer successful')
            return tokenInstance.transfer(accounts[1],1000,{from:admin})
        }).then(function(receipt){
            return tokenInstance.balanceOf(accounts[1])
        }).then(function(balance){
            assert.equal(balance.toNumber(),1000,'Receivers balance')
            return tokenInstance.balanceOf(admin)
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),23000,'Admin balance')
        });
    });

    it('approval for delegated tranfer',function(){
        return LEAFToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1],50000,{from:admin})
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert')>='0','Balance unavailable!')
            return tokenInstance.approve.call(accounts[1],5000,{from:admin})
        }).then(function(success){
            assert.equal(success,true,'Approves for allowance')
            return tokenInstance.approve(accounts[1],5000,{from:admin})
        }).then(function(receipt){
            return tokenInstance.allowance(accounts[0],accounts[1])
        }).then(function(value){
            assert.equal(value.toNumber(),5000,'Allowance value.')
        });
    });

    it('performs the delegated transfer',function(){
        return LEAFToken.deployed().then(function(instance){
            tokenInstance = instance
            return tokenInstance.transferFrom.call(admin,accounts[2],50000,{from:accounts[1]})
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert')>=0,'Invalid value')
            return tokenInstance.transferFrom.call(admin,accounts[2],10000,{from:accounts[1]})
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert')>=0,'Amount greater than allowed value')
            return tokenInstance.transferFrom.call(admin,accounts[2],2500,{from:accounts[1]})
        }).then(function(success){
            assert.equal(success,true,'Delegated transfer successful!')
            return tokenInstance.transferFrom(admin,accounts[2],2500,{from:accounts[1]})
        }).then(function(receipt){
            return tokenInstance.balanceOf(accounts[2])
        }).then(function(balance){
            assert.equal(balance.toNumber(),2500,'Receiver balance')
        });
    });

    it('donation works properly',function(){
        return LEAFToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.donate.call(accounts[1],3000000,{from:accounts[0]})
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert')>=0,'Invalid')
            return tokenInstance.donate.call(accounts[1],30000)
        }).then(function(success){
            assert.equal(success,true,'Success')
        }).then(assert.fail).catch(function(error){
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert')>=0,'Only Admin can donate!')
            assert(error.message.toString().indexOf('revert')>=0,'Not enough tokens!')
            return tokenInstance.donate.call(accounts[1],400,{from:admin})
        }).then(function(success){
            assert.equal(success,true,'Success')
            return tokenInstance.donate(accounts[1],400,{from:admin})
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin)
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),23600,'Admin balance')
            return tokenInstance.balanceOf(accounts[1])
        }).then(function(balance){
            assert.equal(balance.toNumber(),1,'Receivers balance')
        });
    });
});