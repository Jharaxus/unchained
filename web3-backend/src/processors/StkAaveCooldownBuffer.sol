// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "solmate/auth/Owned.sol";
import "../third-party/StakedToken.sol";

contract StkAaveCooldownBuffer is Owned {
    ERC20 aave;
    StakedToken stkAave;
    uint256 public amountOnCooldown;

    constructor(address _aave, address _stkAave, address _owner) Owned(_owner) {
        aave = ERC20(_aave);
        stkAave = StakedToken(_stkAave);
    }

    function cooldownEnded() public view returns (bool) {
        uint256 cooldownStartTimestamp = stkAave.stakersCooldowns(msg.sender);
        return block.timestamp > cooldownStartTimestamp + stkAave.COOLDOWN_SECONDS();
    }

    function cooldownOutdated() public view returns (bool) {
        uint256 cooldownStartTimestamp = stkAave.stakersCooldowns(msg.sender);
        return block.timestamp - (cooldownStartTimestamp + stkAave.COOLDOWN_SECONDS()) <= stkAave.UNSTAKE_WINDOW();
    }

    function completeWithdraw() public onlyOwner {
        stkAave.redeem(owner, amountOnCooldown);
        stkAave.claimRewards(owner, type(uint256).max);
    }

    function startCooldown(uint256 amount) public onlyOwner {
        amountOnCooldown = amount;
        stkAave.cooldown();
    }
}
