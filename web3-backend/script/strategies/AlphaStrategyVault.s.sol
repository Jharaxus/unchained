// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../../src/protocol/StrategyVault.sol";
import "../../src/processors/AlphaStrategyProcessor.sol";

contract AlphaStrategyVaultScript is Script {
    address aaveAddress = 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9;
    address stkAaveeAddress = 0x4da27a545c0c5B758a6BA100e3a049001de870f5;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        StrategyVault alphaVault = new StrategyVault(aaveAddress, "Alpha vault", "aUVault");
        AlphaStrategyProcessor processor = new AlphaStrategyProcessor(aaveAddress, stkAaveeAddress, address(alphaVault));
        alphaVault.setupProcessor(address(processor));

        vm.stopBroadcast();
    }
}
