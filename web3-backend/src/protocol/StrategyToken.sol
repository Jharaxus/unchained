// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "solmate/tokens/ERC20.sol";
import "solmate/auth/Owned.sol";

contract StrategyToken is ERC20, Owned {
    constructor(address _owner, string memory _name, string memory _symbol, uint8 _decimals)
        Owned(_owner)
        ERC20(_name, _symbol, _decimals)
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
