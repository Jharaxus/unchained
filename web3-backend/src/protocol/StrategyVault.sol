// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "solmate/tokens/ERC20.sol";
import "./StrategyToken.sol";

abstract contract StrategyVault {
    string public name;
    ERC20 immutable underlyingAsset;
    ERC20 immutable vaultToken;

    constructor(string memory _name, address _underlyingAsset, string memory _vaultTokenSymbol) {
        name = _name;
        underlyingAsset = ERC20(_underlyingAsset);
        vaultToken =
            new StrategyToken(address(this), string.concat("U", _name), _vaultTokenSymbol, underlyingAsset.decimals());
    }

    function assetsDelegated(address _delegator) external view returns (uint256) {
        return vaultToken.balanceOf(_delegator);
    }

    function delegate(address _delegator, uint256 _amount) external virtual {
        underlyingAsset.transferFrom(_delegator, address(this), _amount);
        StrategyToken(address(vaultToken)).mint(_delegator, _amount);
    }

    function totalAssetsDelegated() external view returns (uint256) {
        return vaultToken.totalSupply();
    }

    function withdraw(address _receiver, uint256 _amount) external virtual {
        require(vaultToken.balanceOf(_receiver) >= _amount, "Insuficient funds to withdraw");
        // TODO: call processor
        StrategyToken(address(vaultToken)).burn(_receiver, _amount);
    }
}
