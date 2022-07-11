const LEAFToken = artifacts.require("./LEAFToken.sol");
const LEAFTokenSale = artifacts.require("./LEAFTokenSale.sol");

module.exports = function(deployer){
  deployer.deploy(LEAFToken,'LEAF Token','LEAF','LEAF Token v1.0.0',24000).then(function(){
    var tokenPrice=1000000000000000;
    return deployer.deploy(LEAFTokenSale,LEAFToken.address,tokenPrice);
  });
}
