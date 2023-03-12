// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "..//third-party/ERC20.sol";
import "solmate/auth/Owned.sol";

abstract contract StrategyProcessor is Owned {
    ERC20 public immutable startingAsset;

    event depositProcessed(uint256 amount);
    event withdrawProcessed(address to, uint256 assets, uint256 shares);

    constructor(address _startingAsset, address _owner) Owned(_owner) {
        startingAsset = ERC20(_startingAsset);
    }

    function processDeposit(uint256 amount) public onlyOwner {
        _processDeposit(amount);
        emit depositProcessed(amount);
    }

    function processWithdraw(address to, uint256 assets, uint256 shares) public virtual onlyOwner {
        _processWithdraw(to, assets, shares);
        emit withdrawProcessed(to, assets, shares);
    }

    function completeWithdraw(address to) public virtual;

    function totalAssets() public view virtual returns (uint256);

    function _processDeposit(uint256 amount) internal virtual;

    function _processWithdraw(address to, uint256 assets, uint256 shares) internal virtual;
}
