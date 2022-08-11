App = {
    web3Provider:null,
    contracts : {},
    account : '0x0',
    tokenPrice : 1000000000000000,
    tokensAvailable : 0,
    tokensSold : 0,
    tokenDefault :100,

    init : function(){
        console.log('App is initialized!')
        App.initWeb3()
    },
    initWeb3 : function(){
        if(typeof web3!=='undefined'){
            App.web3Provider = window.ethereum
            web3 = new Web3(window.ethereum)
            console.log('Web 3 initialized')
        }else{
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
            web3 = new Web3(App.web3Provider)
        }
        App.initContracts()
    },
    initContracts : function(){
        $.getJSON("LEAFToken.json",function(LEAFToken){
            App.contracts.LEAFToken = TruffleContract(LEAFToken)
            App.contracts.LEAFToken.setProvider(App.web3Provider)
            App.contracts.LEAFToken.deployed().then(function(LEAFToken){
                console.log('LEAF Token Contract Address is : ',LEAFToken.address)
            });
        }).done(function(){
            $.getJSON("LEAFTokenSale.json",function(LEAFTokenSale){
                App.contracts.LEAFTokenSale = TruffleContract(LEAFTokenSale)
                App.contracts.LEAFTokenSale.setProvider(App.web3Provider)
                App.contracts.LEAFTokenSale.deployed().then(function(LEAFTokenSale){
                    console.log('LEAF Token Sale Contract Address is : ',LEAFTokenSale.address)
                });
                App.render();
            });
        });

    },
    render : function(){

        if(window.ethereum){
            ethereum.enable().then(function(acc){
                App.account = acc[0]
                console.log('Your Wallet address is : ',App.account)
                $('.userWalletAddress').text(App.account)
            });
            App.contracts.LEAFToken.deployed().then(function(instance){
                tokenInstance = instance
                return tokenInstance.name()
            }).then(function(name){
                $('.tokenName').text(name)
                return tokenInstance.symbol()
            }).then(function(symbol){
                $('.tokenSymbol').text(symbol)
                return tokenInstance.balanceOf(App.account)
            }).then(function(balance){
                console.log('User Balance : ',balance.toNumber())
                $('.userBalance').html(balance.toNumber())
            });
            App.contracts.LEAFTokenSale.deployed().then(function(instance){
                tokenSaleInstance = instance
                return tokenInstance.balanceOf(tokenSaleInstance.address)
            }).then(function(saleContractBalance){
                App.tokensAvailable = saleContractBalance.toNumber()
                $('.tokensAvailable').html(saleContractBalance.toNumber())
                return tokenSaleInstance.tokenPrice()
            }).then(function(price){
                $('.tokenPrice').html(web3.fromWei(price.toNumber(),"ether"))
                return tokenSaleInstance.tokensSold()
            }).then(function(amount){
                App.tokensSold = amount.toNumber()
                $('.tokensSold').html(amount.toNumber())
                var progressPercent = (Math.ceil(App.tokensSold)/App.tokensAvailable)*100
                console.log('Progress Percent is : ',progressPercent)
                $('#progressBar').css('width', progressPercent + "%");
            });
        }
    },

    buyTokens : function() { 
        var numberOfTokens = $('#numberOfTokens').val()
        App.contracts.LEAFTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance
            return tokenSaleInstance.buyTokens(numberOfTokens,{
                from : App.account,
                value : numberOfTokens * App.tokenPrice,
                gas : 500000
            })
        }).then(function(receipt){
            console.log('Congratulations! Few tokens yours :)')
            location.reload()
        }) 
    },

    donate : function(){
        let donationAddress = $('#donationAddress').val()
        let tokensToDonate = $('#tokensToDonate').val()
        console.log('Donation Address : ',donationAddress)
        console.log('Donation Amount : ',tokensToDonate)
        console.log(typeof(donationAddress))
        return App.contracts.LEAFToken.deployed().then(function(instance){
            tokenInstance = instance
            return tokenInstance.donate(donationAddress,tokensToDonate,{
                from : App.account,
                value : 0,
                gas :500000 
            })
        }).then(function(receipt){
            console.log('Donation Successful!')
            location.reload()
        });
    },

    // serializeObject : function()
    // {
    //     var o = {};
    //     var a = this.serializeArray();
    //     $.each(a, function() {
    //         if (o[this.name] !== undefined) {
    //             if (!o[this.name].push) {
    //                 o[this.name] = [o[this.name]];
    //             }
    //             o[this.name].push(this.value || '');
    //         } else {
    //             o[this.name] = this.value || '';
    //         }
    //     });
    //     return o;
    // }
    
}

// $.fn.serializeObject = function()
// {
//     var o = {};
//     var a = this.serializeArray();
//     $.each(a, function() {
//         if (o[this.name] !== undefined) {
//             if (!o[this.name].push) {
//                 o[this.name] = [o[this.name]];
//             }
//             o[this.name].push(this.value || '');
//         } else {
//             o[this.name] = this.value || '';
//         }
//     });
//     return o;
// };

$(document).ready(function(){
    $(window).on('load',function(){
        App.init();
        // $('form').submit(function() {
        //     // $('#result').text();
        //     console.log(JSON.stringify($('form').serializeObject()));
        //     return false;
        // });
    });
});