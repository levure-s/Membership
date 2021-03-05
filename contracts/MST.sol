pragma solidity >=0.4.22 <0.9.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract MSToken is ERC20 {
    string public symbol;
    string public  name;
    address owner = msg.sender;
    string public lastTx ;
    event buyToken(address _sender, uint _value);
    event surrenderToken(address _sender, uint _value);
    

    constructor() public {
        symbol = "MST";
        name = "MembershipToken";
        _mint(msg.sender, 11579208923731619542357098500868790785326998466564056403945758400791312963993);
    }

    function balanceOfMe() public view returns (uint) {
        return balanceOf(msg.sender);
    }
    
    function BuyToken(uint _num)public{
        emit buyToken(msg.sender,_num);
    }
    
    function SurrenderToken(uint _num)public{
        transfer(owner,_num);
        emit surrenderToken(msg.sender,_num);
    }

    function setLastTx(string memory _Txid)public{
        lastTx = _Txid;
    }

    function getLastTx() public view returns (string memory){
        return lastTx;
    }
}