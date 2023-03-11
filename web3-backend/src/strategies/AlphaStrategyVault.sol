// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../protocol/StrategyVault.sol";

contract AlphaStrategyVault is StrategyVault {
    address immutable aave = 0xC13eac3B4F9EED480045113B7af00F7B5655Ece8;

    constructor() StrategyVault("Alpha vault", aave, "aUN") {}
}
