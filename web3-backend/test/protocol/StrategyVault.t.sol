// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../../src/protocol/StrategyVault.sol";
import "../../src/protocol/StrategyProcessor.sol";

contract DummyProcessor is StrategyProcessor {
    uint256 public depositAmount = 0;

    address public withdrawTo = address(0);
    uint256 public withdrawAssets = 0;
    uint256 public withdrawShares = 0;

    constructor(address _startingAsset, address _owner) StrategyProcessor(_startingAsset, _owner) {}

    function _processDeposit(uint256 amount) internal virtual override {
        depositAmount += amount;
    }

    function _processWithdraw(address to, uint256 assets, uint256 shares) internal virtual override {
        withdrawTo = to;
        withdrawAssets = assets;
        withdrawShares = shares;
        startingAsset.transfer(to, assets);
    }

    function totalAssets() public view virtual override returns (uint256) {
        return startingAsset.balanceOf(address(this));
    }
}

contract DummyERC20 is ERC20 {
    constructor() ERC20("dummy", "dmy", 16) {}

    function freeMint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract DummyUser {
    DummyERC20 public token;
    StrategyVault public vault;

    constructor(DummyERC20 _token, StrategyVault _vault) {
        token = _token;
        vault = _vault;
    }

    function deposit(uint256 amount) public {
        token.freeMint(address(this), amount);
        token.approve(address(vault), amount);
        vault.deposit(amount, address(this));
    }
}

contract StrategyVaultTest is Test {
    DummyERC20 public token;
    DummyProcessor public processor;
    StrategyVault public vault;

    function setUp() public {
        token = new DummyERC20();
        vault = new StrategyVault(address(token), "Alpha vault", "aUVault");
        processor = new DummyProcessor(address(token), address(vault));
        vault.setupProcessor(address(processor));
    }

    function testPartialDepositWorks() public {
        token.freeMint(address(this), 100);
        token.approve(address(vault), 100);
        vault.deposit(100, address(this));

        assertEq(token.balanceOf(address(vault)), 100);
        assertEq(vault.balanceOf(address(this)), 100);
    }

    function testCompleteDepositWorks() public {
        token.freeMint(address(this), 100);
        token.approve(address(vault), 100);
        vault.deposit(100, address(this));

        token.freeMint(address(this), 150);
        token.approve(address(vault), 150);
        vault.deposit(150, address(this));

        vault.batchProcessDeposit();
        assertEq(processor.depositAmount(), 250);
        assertEq(vault.balanceOf(address(this)), 250);
        assertEq(token.balanceOf(address(vault)), 0);
        assertEq(token.balanceOf(address(processor)), 250);
    }

    function testWithdrawAfterCompleteDepositWorks() public {
        DummyUser dummyUser = new DummyUser(token, vault);
        dummyUser.deposit(200);

        token.freeMint(address(this), 100);
        token.approve(address(vault), 100);
        vault.deposit(100, address(this));

        vault.batchProcessDeposit();
        vault.withdraw(100, address(this), address(this));

        assertEq(processor.withdrawTo(), address(vault));
        assertEq(processor.withdrawAssets(), 100);
        assertEq(vault.balanceOf(address(this)), 0);
        assertEq(token.balanceOf(address(this)), 100);
    }

    function testWithdrawAfterPartialDepositWorks() public {
        DummyUser user = new DummyUser(token, vault);
        user.deposit(200);

        token.freeMint(address(this), 100);
        token.approve(address(vault), 100);
        vault.deposit(100, address(this));

        vault.withdraw(100, address(this), address(this));

        assertEq(processor.withdrawAssets(), 0);
        assertEq(vault.balanceOf(address(this)), 0);
        assertEq(token.balanceOf(address(this)), 100);
    }

    function testWithdrawStalledAfterMixDepositWorks() public {
        DummyUser user = new DummyUser(token, vault);
        user.deposit(200);

        token.freeMint(address(this), 100);
        token.approve(address(vault), 100);
        vault.deposit(100, address(this));

        vault.batchProcessDeposit();

        token.freeMint(address(this), 200);
        token.approve(address(vault), 200);
        vault.deposit(200, address(this));

        vault.withdraw(100, address(this), address(this));

        assertEq(processor.withdrawTo(), address(0));
        assertEq(processor.withdrawAssets(), 0);
        assertEq(vault.balanceOf(address(this)), 200);
        assertEq(token.balanceOf(address(this)), 100);
        assertEq(token.balanceOf(address(vault)), 100);
        assertEq(token.balanceOf(address(processor)), 300);
    }

    function testWithdrawCompleteAfterMixDepositWorks() public {
        DummyUser user = new DummyUser(token, vault);
        user.deposit(200);

        token.freeMint(address(this), 100);
        token.approve(address(vault), 100);
        vault.deposit(100, address(this));

        vault.batchProcessDeposit();

        token.freeMint(address(this), 200);
        token.approve(address(vault), 200);
        vault.deposit(200, address(this));

        vault.withdraw(250, address(this), address(this));

        assertEq(processor.withdrawTo(), address(vault));
        assertEq(processor.withdrawAssets(), 50);
        assertEq(vault.balanceOf(address(this)), 50);
        assertEq(token.balanceOf(address(this)), 250);
        assertEq(token.balanceOf(address(vault)), 0);
        assertEq(token.balanceOf(address(processor)), 250);
    }
}
