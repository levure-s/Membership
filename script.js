const express = require('express');
const { packageInit } = require('web3-core');
const app = express();
const http = require('http').Server(app);
app.use("/", express.static(__dirname + '/'));
app.get('/', (req, res) => { res.redirect("/"); });


const info = require("./deployed_info.js")
const wallet = new (require("./hdWallet.js"))

var web3 = new (require("web3"));
const INFURA_PROJECT_ID = "d11c17162d934093bf8bafa878e42df7";
web3.setProvider(new web3.providers.WebsocketProvider(`wss://rinkeby.infura.io/ws/v3/${INFURA_PROJECT_ID}`));

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
        this.OWNER_ADDR = await wallet.getAccount()
        console.log(this.OWNER_ADDR)
        return true;
    }

    async buyToken(event){
        var addr = event.returnValues._sender;
		var value = event.returnValues._value;
        console.log("[notice] BuyToken! (addr:" + addr + " ,value:" + value + ")");
        var Tx = await wallet.contractTransfer(addr,value)
        console.log(Tx.transactionHash);
        wallet.setLastTx(Tx.transactionHash)        
    }

    surrenderToken(event){
        var addr = event.returnValues._sender;
		var value = parseInt(event.returnValues._value)-1;
        console.log("[notice] SurrenderToken! (addr:" + addr + " ,value:" + value.toString() + ")");
        if(value>0){
            wallet.sendTransaction(addr,value)
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

