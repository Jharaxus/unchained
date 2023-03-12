export BINANCE=0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8
export ALICE=0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
export BOB=0x70997970c51812dc3a010c7d01b50e0d17dc79c8

export LUCAS=0x75741c5D7AD1BA3881001F0A4C53CaA0016694Fa
export HUGO=0xB6959FC71F64df777de2E8AB58F99c2505798Ce4
export HUGO2=0x08b07679f333da00945990662c27D1cB53756DB7

export ALPHA_VAULT=0x47c05bcca7d57c87083eb4e586007530ee4539e9
export AAVE=0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9

export BINANCE_BALANCE_A=00000400000000000000000000
export BINANCE_BALANCE_B=00000200000000000000000000

forge script script/strategies/AlphaStrategyVault.s.sol:AlphaStrategyVaultScript --fork-url http://localhost:8545 --broadcast
cast call $AAVE "balanceOf(address)(uint256)" $BINANCE

echo "Balance done"

cast rpc anvil_impersonateAccount $BINANCE
cast send $AAVE --from $BINANCE "transfer(address,uint256)(bool)" $ALICE $BINANCE_BALANCE_A
cast send $AAVE --from $BINANCE "transfer(address,uint256)(bool)" $BOB $BINANCE_BALANCE_B

cast send $AAVE --from $BINANCE "transfer(address,uint256)(bool)" $LUCAS $BINANCE_BALANCE_A
cast send $AAVE --from $BINANCE "transfer(address,uint256)(bool)" $HUGO $BINANCE_BALANCE_A
cast send $AAVE --from $BINANCE "transfer(address,uint256)(bool)" $HUGO2 $BINANCE_BALANCE_A

echo "transfer Aave done"

cast send $LUCAS --from $BINANCE --value 100ether
cast send $HUGO  --from $BINANCE --value 100ether
cast send $HUGO2  --from $BINANCE --value 100ether

echo "Transfer ether done"

cast call $AAVE "balanceOf(address)(uint256)" $ALICE
cast call $AAVE "balanceOf(address)(uint256)" $BOB
cast call $AAVE "balanceOf(address)(uint256)" $LUCAS
cast call $AAVE "balanceOf(address)(uint256)" $HUGO