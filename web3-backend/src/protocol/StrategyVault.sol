// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "solmate/auth/Owned.sol";
import "../tokens/ERC4626.sol";
import "./StrategyProcessor.sol";

import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";

contract StrategyVault is ERC4626, Owned {
    using SafeTransferLib for ERC20;

    struct StalledAsset {
        uint256 amount;
        uint256 lastBatchDepositId;
    }

    StrategyProcessor public processor;
    bool processorSetup = false;

    uint256 lastBatchDepositId = 0;
    mapping(address => StalledAsset) stalledAssets;

    event BatchDepositProcessed(uint256 amount, address author, uint256 id);

    constructor(address _underlyingAsset, string memory _name, string memory _symbol)
        ERC4626(ERC20(_underlyingAsset), _name, _symbol)
        Owned(msg.sender)
    {}

    function batchProcessDeposit() public {
        require(processorSetup, "Owner must first setup the processor");

        uint256 amountToDeposit = asset.balanceOf(address(this));
        asset.safeTransfer(address(processor), amountToDeposit);
        processor.processDeposit(amountToDeposit);

        emit BatchDepositProcessed(amountToDeposit, msg.sender, lastBatchDepositId);

        lastBatchDepositId += 1; // Invalidate stalled assets
    }

    function setupProcessor(address processorAddress) public onlyOwner {
        // Prevents stealing funds by swapping the processor with a fake one
        require(!processorSetup, "Only a single setup is allowed");
        processor = StrategyProcessor(processorAddress);
        processorSetup = true;
    }

    function totalAssets() public view virtual override returns (uint256) {
        require(processorSetup, "Owner must first setup the processor");
        return asset.balanceOf(address(this)) + processor.totalAssets();
    }

    function afterDeposit(uint256 assets, uint256, address ownerOfDeposit) internal override {
        if (stalledAssets[ownerOfDeposit].lastBatchDepositId == lastBatchDepositId) {
            stalledAssets[ownerOfDeposit].amount += assets;
        } else {
            stalledAssets[ownerOfDeposit] = StalledAsset(assets, lastBatchDepositId);
        }
    }

    function beforeWithdraw(uint256 assets, uint256 shares, address receiver) internal override {
        require(processorSetup, "Owner must first setup the processor");
        if (stalledAssets[receiver].lastBatchDepositId == lastBatchDepositId) {
            uint256 assetsDeposited =
                assets > stalledAssets[receiver].amount ? assets - stalledAssets[receiver].amount : 0;
            if (assetsDeposited > 0) {
                uint256 sharesDeposited = previewWithdraw(assetsDeposited);
                processor.processWithdraw(address(this), assetsDeposited, sharesDeposited);
            }
        } else {
            processor.processWithdraw(address(this), assets, shares);
        }
    }
}
