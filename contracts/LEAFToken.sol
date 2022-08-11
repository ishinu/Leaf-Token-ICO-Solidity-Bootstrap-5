//SPDX-License-Identifier:MIT

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity <0.9.0;

contract LEAFToken is Ownable{
    string public name;
    string public symbol;
    string public standard;
    uint public totalSupply;
    address public admin;

    mapping(address=>uint) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allowance;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address owner,
        address spender,
        uint256 value
    );

    constructor (string memory _name,string memory _symbol,string memory _standard,uint _totalSupply) {
        name = _name;
        symbol = _symbol;
        standard = _standard;
        totalSupply = _totalSupply;
        admin = msg.sender;
        balanceOf[msg.sender] = _totalSupply;
    }

    function transfer(address _to,uint _value) public returns(bool success){
        require(balanceOf[msg.sender]>= _value);
        balanceOf[msg.sender]-=_value;
        balanceOf[_to]+=_value;
        emit Transfer(msg.sender,_to,_value);
        return true;
    }

    function donate(address _to,uint256 _tokensToDonate) public onlyOwner returns (bool success) {
        require(balanceOf[admin]>=_tokensToDonate);
        balanceOf[admin] -= _tokensToDonate;
        balanceOf[_to] += _tokensToDonate;
        emit Transfer(admin,_to,_tokensToDonate);
        return true;
    }

    function approve (address _to,uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender]>=_value);
        allowance[msg.sender][_to] = _value;
        emit Approval(msg.sender,_to,_value);
        return true;
    }

    function transferFrom(address _from,address _to,uint256 _value) public returns (bool success){
        require(allowance[_from][msg.sender]>=_value);
        require(balanceOf[_from]>=_value);
        balanceOf[_from]-=_value;
        allowance[_from][msg.sender]-=_value;
        balanceOf[_to]+=_value;
        emit Transfer(_from,_to,_value);
        return true;
    }
}