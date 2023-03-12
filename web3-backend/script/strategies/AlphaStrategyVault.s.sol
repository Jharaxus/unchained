// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../../src/protocol/StrategyVault.sol";
import "../../src/processors/AlphaStrategyProcessor.sol";

contract AlphaStrategyVaultScript is Script {
    address aaveAddress = 0xC13eac3B4F9EED480045113B7af00F7B5655Ece8;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        StrategyVault alphaVault = new StrategyVault(aaveAddress, "Alpha vault", "aUVault");
        AlphaStrategyProcessor processor = new AlphaStrategyProcessor(aaveAddress, address(alphaVault));
        alphaVault.setupProcessor(address(processor));

        vm.stopBroadcast();
    }
}
