// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../../src/processors/AlphaStrategyProcessor.sol";

contract DummyAave is ERC20 {
    constructor() ERC20("Dummy Aave", "dmyAave", 16) {}

    function freeMint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract DummyStakedAave is IStakedAave, ERC20 {
    ERC20 aave;

    constructor(address _aave) ERC20("dummy stake aave", "dstkaave", ERC20(_aave).decimals()) {
        aave = ERC20(_aave);
    }

    function stake(address to, uint256 amount) external {
        aave.transferFrom(to, address(this), amount);
        _mint(to, amount);
    }

    function redeem(address to, uint256 amount) external {
        aave.transfer(to, amount);
    }

    function cooldown() external {}

    function claimRewards(address to, uint256 amount) external {}
}

contract AlphaStrategyProcessorTest is Test {
    DummyAave public aave;
    DummyStakedAave public stakedAave;
    AlphaStrategyProcessor public processor;

    function setUp() public {
        aave = new DummyAave();
        stakedAave = new DummyStakedAave(address(aave));
        processor = new AlphaStrategyProcessor(address(aave), address(stakedAave), address(this));
    }

    function testDepositStakeAaveWorks() public {
        aave.freeMint(address(processor), 100);
        processor.processDepositStakeAave(100);

        assertEq(aave.balanceOf(address(processor)), 0);
        assertEq(aave.balanceOf(address(stakedAave)), 100);
    }

    function testWithdrawStakeAaveWorks() public {
        aave.freeMint(address(processor), 100);

        processor.processDepositStakeAave(100);
        processor.processWithdrawStakeAave(address(this), 100);

        assertEq(stakedAave.balanceOf(address(processor)), 0);
        assertEq(stakedAave.balanceOf(address(this)), 100);
    }
}
