// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../protocol/StrategyProcessor.sol";
import "../third-party/IStakedAave.sol";

contract AlphaStrategyProcessor is StrategyProcessor {
    IStakedAave stkAave;

    constructor(address _startingAsset, address _stkAave, address _owner) StrategyProcessor(_startingAsset, _owner) {
        stkAave = IStakedAave(_stkAave);
    }

    function totalAssets() public view virtual override returns (uint256) {
        return 0; // TODO later
    }

    function _processDeposit(uint256 amount) internal virtual override {
        processDepositStakeAave(amount);
    }

    function _processWithdraw(address to, uint256 assets, uint256)
        internal
        virtual
        override
        returns (address, uint256)
    {
        processWithdrawStakeAave(to, assets);

        return (address(stkAave), ERC20(address(stkAave)).balanceOf(address(this)));
    }

    function processDepositStakeAave(uint256 amount) public {
        // public only for test purpose --> internal in production
        startingAsset.approve(address(stkAave), amount);
        stkAave.stake(address(this), amount);
    }

    function processWithdrawStakeAave(address to, uint256 assets) public {
        // public only for test purpose --> internal in production
        stkAave.claimRewards(to, type(uint256).max);
        ERC20(address(stkAave)).transfer(address(to), assets);
    }
}
