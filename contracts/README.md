geth --datadir "path\to\own\blockChain" init "path\to\genesis.json"
geth --datadir "path\to\own\blockChain" account new
geth --datadir "path\to\own\blockChain" --networkid 2254 --rpc --rpccorsdomain "*" --rpcapi "admin,miner,web3,eth,personal" console
