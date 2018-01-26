NODE1 (OVH) => Init
Install Geth
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt-get update
$ sudo apt-get install ethereum

NODE1 (OVH)
run geth --datadir "/root/.ethereum/own" init "/root/../var/app/LABankapi/contracts/genesis.json"
run geth --datadir "/root/.ethereum/own" --nodiscover console

run personal.newAccount()
Insert & repeat passphrase
Store address ex : "0x88b8c1d83ea59a7214ce261b0b15cbdb52d3b411"
create file "/root/.ethereum/own/.password" and paste password into

run admin.nodeInfo.enode and store the result:
ex : "enode://cff63ed4c06dcc701e47c3a4d6c8ea90209dd4da1cdec2ae45895eaa471314c73a5dd604c021e0869fda83d9b43ede50ac4d01ece3539c1cc692aed263c9bd37@[::]:30303?discport=0"

NODE2 (LAB) => Miner
Install Geth
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt-get update
$ sudo apt-get install ethereum

Use the same genesis.json file
run geth --datadir "/root/.ethereum/own" init "path/to/genesis.json"
run geth --datadir "/root/.ethereum/own" --nodiscover console

run personal.newAccount()
Insert & repeat passphrase
Store address ex : "0x88b8c1d83ea59a7214ce261b0b15cbdb52d3b411"
create file "/root/.ethereum/own/.password" and paste password into


run admin.addPeer("enode://cff63ed4c06dcc701e47c3a4d6c8ea90209dd4da1cdec2ae45895eaa471314c73a5dd604c021e0869fda83d9b43ede50ac4d01ece3539c1cc692aed263c9bd37@54.37.152.113:30303?discport=0")

Then run to check
NODE2 > admin.peers

NODE1
run geth --datadir "/root/.ethereum/own" --nodiscover --rpc --rpccorsdomain "*" --rpcapi "admin,db,miner,eth,miner,personal,web3" --unlock 0 --password "/root/.ethereum/own/.password" console


then run npm run deploy in aim to deploy contract
miner has to be activated at least on one node

contract address : 0xcc08a260b9bf4887c959f2eec6dc20286325a1c3
