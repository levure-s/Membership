const express = require('express');
const { packageInit } = require('web3-core');
const app = express();
const http = require('http').Server(app);
app.use("/", express.static(__dirname + '/'));
app.get('/', (req, res) => { res.redirect("/"); });


const info = require("./deployed_info.js")

const HDWalletProvider = require('truffle-hdwallet-provider');
var web3 = new (require("web3"));
const INFURA_PROJECT_ID = "d11c17162d934093bf8bafa878e42df7";
const mnemonic = "payment festival describe bird jaguar cram artwork flower video window undo join";
web3.setProvider(new HDWalletProvider(mnemonic, `ws://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`));

var contract = new web3.eth.Contract(info.abi, info.address);

class MSToken{
    async startSystem() {
        var result = await this.initGanache();
        if(result == false) {
            console.log("startSystem: ERR. please restart 'Ganache' and reTry.")
            return;
        }

        http.listen(3000, () => {
            console.log('listen 3000');
        });
    }

    async initGanache() {
        this.accounts = await web3.eth.getAccounts();
        this.OWNER_ADDR = this.accounts[0];
        return true;
    }

    async buyToken(event){
        var addr = event.returnValues._sender;
		var value = event.returnValues._value;
        console.log("[notice] BuyToken! (addr:" + addr + " ,value:" + value + ")");
        var Tx = await contract.methods.transfer(addr,value).send({from:this.OWNER_ADDR, gas: '5000000'});
        console.log(Tx.transactionHash);
        contract.methods.setLastTx(Tx.transactionHash).send({from:this.OWNER_ADDR, gas: '5000000'});        
    }

    surrenderToken(event){
        var addr = event.returnValues._sender;
		var value = parseInt(event.returnValues._value)-1;
        var wei = parseInt(web3.utils.toWei(value.toString(), 'ether'));
        console.log("[notice] SurrenderToken! (addr:" + addr + " ,value:" + value.toString() + ")");
        if(value>0){
            web3.eth.sendTransaction({from:this.OWNER_ADDR, to:addr,value: wei, gas:5500000})
        }          
    }
}
var v = new MSToken()
v.startSystem()
contract.events.buyToken({}, (err,event) => {
    if(!err) {
		v.buyToken(event)    
    } else {
        console.log(err);
    }
});
contract.events.surrenderToken({}, (err,event) => {
    if(!err) {
		v.surrenderToken(event)
    } else {
        console.log(err);
    }
});

