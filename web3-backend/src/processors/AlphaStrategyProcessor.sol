// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../protocol/StrategyProcessor.sol";

contract AlphaStrategyProcessor is StrategyProcessor {
    constructor(address _startingAsset, address _owner) StrategyProcessor(_startingAsset, _owner) {}

    function _processDeposit(uint256 amount) internal virtual override {
        // TODO
    }

    function _processWithdraw(address to, uint256 assets, uint256) internal virtual override {
        startingAsset.transfer(to, assets);
    }

    function totalAssets() public view virtual override returns (uint256) {
        return 0; // TODO
    }
}
