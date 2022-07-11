//SPDX-License-Identifier:MIT

import "./LEAFToken.sol";

pragma solidity <0.9.0;

contract LEAFTokenSale{ 
    uint256 public tokenPrice;
    uint256 public tokensSold;
    LEAFToken tokenContract;

    address admin;

    event Sell(
        address _buyer,
        uint256 _amount
    );

    constructor (LEAFToken _tokenContract,uint256 _tokenPrice){
        tokenContract = _tokenContract;
        admin = msg.sender;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x,uint y) internal pure returns (uint z){
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable{
        require(msg.value == _numberOfTokens*tokenPrice);
        require(tokenContract.balanceOf(address(this))>=_numberOfTokens);
        tokenContract.transfer(msg.sender,_numberOfTokens);
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender,_numberOfTokens);
    }

    function endSale() public{
        require(msg.sender == admin);
        require(tokenContract.transfer(admin,tokenContract.balanceOf(address(this))));
        selfdestruct(payable(admin));
    }
}