const fs = require('fs');
var MSToken = artifacts.require("MSToken");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(MSToken).then((instance) => {
        obj_MSToken = instance;
    }).then(() => {
        const outputfilename1 = "./deployed_info.js";
        var msg = "var deployed_network = '" + network + "'\r\n\r\n"; 
        msg += "var deploy_account = '" + accounts[0] + "'\r\n\r\n";
        msg += "var address = '" + obj_MSToken.address + "'\r\n"; 
        msg += "var abi = " + JSON.stringify(obj_MSToken.abi) + "\r\n\r\n";
        msg += "module.exports = {\r\n";
        msg += "deployed_network : deployed_network,\r\n";    
        msg += "deploy_account : deploy_account,\r\n";    
        msg += "address : address,\r\n";
        msg += "abi : abi\r\n";    
        msg += "}\r\n";
        fs.writeFileSync(outputfilename1, msg);
    });;
};