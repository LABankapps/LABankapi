geth --datadir "T:\Programs\Ethereum\Own" init "T:\LAB\LABank\genesis.json"
geth --datadir "T:\Programs\Ethereum\Own\" account new
geth --datadir "T:\Programs\Ethereum\Own\" --networkid 2154 --rpc --rpccorsdomain "*" --rpcapi "admin,miner,web3,eth,personal" console
