export BINANCE=0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8

export YOUR_KEY=0xbE1F791d8E7001a15Ca0Be6FC4E3B50b3A219538

export ALPHA_VAULT=0x47c05bcca7d57c87083eb4e586007530ee4539e9
export AAVE=0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9

export BINANCE_BALANCE_A=00000400000000000000000000
export BINANCE_BALANCE_B=00000200000000000000000000

forge script script/strategies/AlphaStrategyVault.s.sol:AlphaStrategyVaultScript --fork-url http://localhost:8545 --broadcast
cast call $AAVE "balanceOf(address)(uint256)" $BINANCE

echo "Balance done"

cast rpc anvil_impersonateAccount $BINANCE
cast send $AAVE --from $BINANCE "transfer(address,uint256)(bool)" $YOUR_KEY $BINANCE_BALANCE_A

echo "transfer Aave done"

cast send $YOUR_KEY  --from $BINANCE --value 100ether

echo "Transfer ether done"