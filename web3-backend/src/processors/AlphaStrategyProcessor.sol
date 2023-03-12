// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../protocol/StrategyProcessor.sol";
import "../third-party/IStakedAave.sol";
import "./StkAaveCooldownBuffer.sol";

contract AlphaStrategyProcessor is StrategyProcessor {
    struct CooldownBuffers {
        mapping(uint256 => address) buffers;
        uint256 firstBuffer;
        uint256 nextBuffer;
    }

    IStakedAave stkAave;

    mapping(address => CooldownBuffers) cooldownBuffers;

    event withdrawCooldownRestarted(address to);

    constructor(address _startingAsset, address _stkAave, address _owner) StrategyProcessor(_startingAsset, _owner) {
        stkAave = IStakedAave(_stkAave);
    }

    function completeWithdraw(address to) public override {
        CooldownBuffers storage cd = cooldownBuffers[to];
        uint256 lastBuffer = cd.nextBuffer;
        for (uint256 bufferId = cd.firstBuffer; bufferId < lastBuffer; ++bufferId) {
            StkAaveCooldownBuffer buffer = StkAaveCooldownBuffer(cd.buffers[bufferId]);
            if (buffer.cooldownEnded()) {
                if (!buffer.cooldownOutdated()) {
                    buffer.completeWithdraw();
                } else {
                    // We need to restart the cooldown and put the buffer in front of the list again
                    buffer.startCooldown(buffer.amountOnCooldown());
                    cd.buffers[cd.nextBuffer] = address(buffer);
                    cd.nextBuffer += 1;
                }
                cd.firstBuffer += 1;
            } else {
                // No more buffer can be completed as they are chronologycally sorted
                break;
            }
        }
    }

    function totalAssets() public view virtual override returns (uint256) {
        return 0; // TODO later
    }

    function _processDeposit(uint256 amount) internal virtual override {
        processDepositStakeAave(amount);
    }

    function _processWithdraw(address to, uint256 assets, uint256) internal virtual override {
        processWithdrawStakeAave(to, assets);

        startingAsset.transfer(address(owner), assets);
    }

    function processDepositStakeAave(uint256 amount) public {
        // public only for test purpose --> internal in production
        startingAsset.approve(address(stkAave), amount);
        stkAave.stake(address(this), amount);
    }

    function processWithdrawStakeAave(address to, uint256 amount) public {
        // public only for test purpose --> internal in production
        stkAave.claimRewards(to, type(uint256).max);

        CooldownBuffers storage cd = cooldownBuffers[to];
        StkAaveCooldownBuffer nBuffer =
            new StkAaveCooldownBuffer(address(startingAsset), address(stkAave), address(this));

        cd.buffers[cd.nextBuffer] = address(nBuffer);
        ERC20(address(stkAave)).transfer(address(nBuffer), amount);
        nBuffer.startCooldown(amount);
        nBuffer.transferOwnership(to);
        cd.nextBuffer += 1;
    }
}
