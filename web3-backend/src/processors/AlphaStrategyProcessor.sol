// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../protocol/StrategyProcessor.sol";
import "../third-party/IStakedAave.sol";

contract AlphaStrategyProcessor is StrategyProcessor {
    IStakedAave stkAave;

    constructor(address _startingAsset, address _stkAaveeAddress, address _owner)
        StrategyProcessor(_startingAsset, _owner)
    {
        stkAave = IStakedAave(_stkAaveeAddress);
    }

    function _processDeposit(uint256 amount) internal virtual override {
        processDepositStakeAave(amount);
    }

    function processDepositStakeAave(uint256 amount) public {
        startingAsset.approve(address(stkAave), amount);
        stkAave.stake(address(this), amount);
    }

    function _processWithdraw(address to, uint256 assets, uint256) internal virtual override {
        processWithdrawStakeAave(to, assets);

        startingAsset.transfer(address(owner), assets);
    }

    function processWithdrawStakeAave(address to, uint256 amount) public {
        stkAave.redeem(address(this), amount);
        stkAave.claimRewards(to, amount);
    }

    function totalAssets() public view virtual override returns (uint256) {
        return 0; // TODO later
    }
}
