const web3 = new (require("web3"));
const HDWalletProvider = require('truffle-hdwallet-provider');
const INFURA_PROJECT_ID = "d11c17162d934093bf8bafa878e42df7";
const mnemonic = "payment festival describe bird jaguar cram artwork flower video window undo join";
const info = require("./deployed_info.js")
web3.setProvider(new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`));
var contract = new web3.eth.Contract(info.abi, info.address);

class Wallet{
    async getAccount(){
        var accounts = await web3.eth.getAccounts();
        var OWNER_ADDR = accounts[0];
        return OWNER_ADDR;
    }

    async sendTransaction(addr,value){
        var wei = parseInt(web3.utils.toWei(value.toString(), 'ether'));
        var Tx = await web3.eth.sendTransaction({from:info.deploy_account, to:addr,value: wei, gas:5500000})
        .catch((err)=>{
            console.log(err)
        });
        console.log(Tx.transactionHash)
    }

    async contractTransfer(addr,value){
        var Tx = await contract.methods.transfer(addr,parseInt(value)).send({from:info.deploy_account, gas: '5000000'})
        .catch((err)=>{
            console.log(err)
        });
        return Tx
    }

    async setLastTx(transactionHash){
        await contract.methods.setLastTx(transactionHash).send({from:info.deploy_account, gas: '5000000'})
        .catch((err)=>{
            console.log(err)
        });

    }
}
module.exports = Wallet