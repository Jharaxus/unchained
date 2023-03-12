// SPDX-License-Identifier: agpl-3.0
pragma solidity >=0.6.12;
pragma experimental ABIEncoderV2;

import {IStakedAave} from "./IStakedAave.sol";
import {SafeMath, ERC20, IERC20} from "./ERC20.sol";

/**
 * @title VersionedInitializable
 *
 * @dev Helper contract to support initializer functions. To use it, replace
 * the constructor with a function that has the `initializer` modifier.
 * WARNING: Unlike constructors, initializer functions must be manually
 * invoked. This applies both to deploying an Initializable contract, as well
 * as extending an Initializable contract via inheritance.
 * WARNING: When used with inheritance, manual care must be taken to not invoke
 * a parent initializer twice, or ensure that all initializers are idempotent,
 * because this is not dealt with automatically as with constructors.
 *
 * @author Aave, inspired by the OpenZeppelin Initializable contract
 */
abstract contract VersionedInitializable {
    /**
     * @dev Indicates that the contract has been initialized.
     */
    uint256 internal lastInitializedRevision = 0;

    /**
     * @dev Modifier to use in the initializer function of a contract.
     */
    modifier initializer() {
        uint256 revision = getRevision();
        require(revision > lastInitializedRevision, "Contract instance has already been initialized");

        lastInitializedRevision = revision;

        _;
    }

    /// @dev returns the revision number of the contract.
    /// Needs to be defined in the inherited class as a constant.
    function getRevision() internal pure virtual returns (uint256);

    // Reserved storage space to allow for layout changes in the future.
    uint256[50] private ______gap;
}

library DistributionTypes {
    struct AssetConfigInput {
        uint128 emissionPerSecond;
        uint256 totalStaked;
        address underlyingAsset;
    }

    struct UserStakeInput {
        address underlyingAsset;
        uint256 stakedByUser;
        uint256 totalStaked;
    }
}

interface IAaveDistributionManager {
    function configureAssets(DistributionTypes.AssetConfigInput[] calldata assetsConfigInput) external;
}

/**
 * @title AaveDistributionManager
 * @notice Accounting contract to manage multiple staking distributions
 * @author Aave
 *
 */
contract AaveDistributionManager is IAaveDistributionManager {
    using SafeMath for uint256;

    struct AssetData {
        uint128 emissionPerSecond;
        uint128 lastUpdateTimestamp;
        uint256 index;
        mapping(address => uint256) users;
    }

    uint256 public immutable DISTRIBUTION_END;

    address public immutable EMISSION_MANAGER;

    uint8 public constant PRECISION = 18;

    mapping(address => AssetData) public assets;

    event AssetConfigUpdated(address indexed asset, uint256 emission);
    event AssetIndexUpdated(address indexed asset, uint256 index);
    event UserIndexUpdated(address indexed user, address indexed asset, uint256 index);

    constructor(address emissionManager, uint256 distributionDuration) {
        DISTRIBUTION_END = block.timestamp + (distributionDuration);
        EMISSION_MANAGER = emissionManager;
    }

    /**
     * @dev Configures the distribution of rewards for a list of assets
     * @param assetsConfigInput The list of configurations to apply
     *
     */
    function configureAssets(DistributionTypes.AssetConfigInput[] calldata assetsConfigInput) external override {
        require(msg.sender == EMISSION_MANAGER, "ONLY_EMISSION_MANAGER");

        for (uint256 i = 0; i < assetsConfigInput.length; i++) {
            AssetData storage assetConfig = assets[assetsConfigInput[i].underlyingAsset];

            _updateAssetStateInternal(
                assetsConfigInput[i].underlyingAsset, assetConfig, assetsConfigInput[i].totalStaked
            );

            assetConfig.emissionPerSecond = assetsConfigInput[i].emissionPerSecond;

            emit AssetConfigUpdated(assetsConfigInput[i].underlyingAsset, assetsConfigInput[i].emissionPerSecond);
        }
    }

    /**
     * @dev Updates the state of one distribution, mainly rewards index and timestamp
     * @param underlyingAsset The address used as key in the distribution, for example sAAVE or the aTokens addresses on Aave
     * @param assetConfig Storage pointer to the distribution's config
     * @param totalStaked Current total of staked assets for this distribution
     * @return The new distribution index
     *
     */
    function _updateAssetStateInternal(address underlyingAsset, AssetData storage assetConfig, uint256 totalStaked)
        internal
        returns (uint256)
    {
        uint256 oldIndex = assetConfig.index;
        uint128 lastUpdateTimestamp = assetConfig.lastUpdateTimestamp;

        if (block.timestamp == lastUpdateTimestamp) {
            return oldIndex;
        }

        uint256 newIndex = _getAssetIndex(oldIndex, assetConfig.emissionPerSecond, lastUpdateTimestamp, totalStaked);

        if (newIndex != oldIndex) {
            assetConfig.index = newIndex;
            emit AssetIndexUpdated(underlyingAsset, newIndex);
        }

        assetConfig.lastUpdateTimestamp = uint128(block.timestamp);

        return newIndex;
    }

    /**
     * @dev Updates the state of an user in a distribution
     * @param user The user's address
     * @param asset The address of the reference asset of the distribution
     * @param stakedByUser Amount of tokens staked by the user in the distribution at the moment
     * @param totalStaked Total tokens staked in the distribution
     * @return The accrued rewards for the user until the moment
     *
     */
    function _updateUserAssetInternal(address user, address asset, uint256 stakedByUser, uint256 totalStaked)
        internal
        returns (uint256)
    {
        AssetData storage assetData = assets[asset];
        uint256 userIndex = assetData.users[user];
        uint256 accruedRewards = 0;

        uint256 newIndex = _updateAssetStateInternal(asset, assetData, totalStaked);

        if (userIndex != newIndex) {
            if (stakedByUser != 0) {
                accruedRewards = _getRewards(stakedByUser, newIndex, userIndex);
            }

            assetData.users[user] = newIndex;
            emit UserIndexUpdated(user, asset, newIndex);
        }

        return accruedRewards;
    }

    /**
     * @dev Used by "frontend" stake contracts to update the data of an user when claiming rewards from there
     * @param user The address of the user
     * @param stakes List of structs of the user data related with his stake
     * @return The accrued rewards for the user until the moment
     *
     */
    function _claimRewards(address user, DistributionTypes.UserStakeInput[] memory stakes) internal returns (uint256) {
        uint256 accruedRewards = 0;

        for (uint256 i = 0; i < stakes.length; i++) {
            accruedRewards = accruedRewards
                + (_updateUserAssetInternal(user, stakes[i].underlyingAsset, stakes[i].stakedByUser, stakes[i].totalStaked));
        }

        return accruedRewards;
    }

    /**
     * @dev Return the accrued rewards for an user over a list of distribution
     * @param user The address of the user
     * @param stakes List of structs of the user data related with his stake
     * @return The accrued rewards for the user until the moment
     *
     */
    function _getUnclaimedRewards(address user, DistributionTypes.UserStakeInput[] memory stakes)
        internal
        view
        returns (uint256)
    {
        uint256 accruedRewards = 0;

        for (uint256 i = 0; i < stakes.length; i++) {
            AssetData storage assetConfig = assets[stakes[i].underlyingAsset];
            uint256 assetIndex = _getAssetIndex(
                assetConfig.index, assetConfig.emissionPerSecond, assetConfig.lastUpdateTimestamp, stakes[i].totalStaked
            );

            accruedRewards = accruedRewards + (_getRewards(stakes[i].stakedByUser, assetIndex, assetConfig.users[user]));
        }
        return accruedRewards;
    }

    /**
     * @dev Internal function for the calculation of user's rewards on a distribution
     * @param principalUserBalance Amount staked by the user on a distribution
     * @param reserveIndex Current index of the distribution
     * @param userIndex Index stored for the user, representation his staking moment
     * @return The rewards
     *
     */
    function _getRewards(uint256 principalUserBalance, uint256 reserveIndex, uint256 userIndex)
        internal
        pure
        returns (uint256)
    {
        return principalUserBalance * (reserveIndex - (userIndex)) / (10 ** uint256(PRECISION));
    }

    /**
     * @dev Calculates the next value of an specific distribution index, with validations
     * @param currentIndex Current index of the distribution
     * @param emissionPerSecond Representing the total rewards distributed per second per asset unit, on the distribution
     * @param lastUpdateTimestamp Last moment this distribution was updated
     * @param totalBalance of tokens considered for the distribution
     * @return The new index.
     *
     */
    function _getAssetIndex(
        uint256 currentIndex,
        uint256 emissionPerSecond,
        uint128 lastUpdateTimestamp,
        uint256 totalBalance
    ) internal view returns (uint256) {
        if (
            emissionPerSecond == 0 || totalBalance == 0 || lastUpdateTimestamp == block.timestamp
                || lastUpdateTimestamp >= DISTRIBUTION_END
        ) {
            return currentIndex;
        }

        uint256 currentTimestamp = block.timestamp > DISTRIBUTION_END ? DISTRIBUTION_END : block.timestamp;
        uint256 timeDelta = currentTimestamp - (lastUpdateTimestamp);
        return emissionPerSecond * (timeDelta) * (10 ** uint256(PRECISION)) / (totalBalance) + (currentIndex);
    }

    /**
     * @dev Returns the data of an user on a distribution
     * @param user Address of the user
     * @param asset The address of the reference asset of the distribution
     * @return The new index
     *
     */
    function getUserAssetData(address user, address asset) public view returns (uint256) {
        return assets[asset].users[user];
    }
}

interface ITransferHook {
    function onTransfer(address from, address to, uint256 amount) external;
}

/**
 * @title ERC20WithSnapshot
 * @notice ERC20 including snapshots of balances on transfer-related actions
 * @author Aave
 *
 */
contract ERC20WithSnapshot is ERC20 {
    /// @dev snapshot of a value on a specific block, used for balances
    struct Snapshot {
        uint128 blockNumber;
        uint128 value;
    }

    mapping(address => mapping(uint256 => Snapshot)) public _snapshots;
    mapping(address => uint256) public _countsSnapshots;
    /// @dev reference to the Aave governance contract to call (if initialized) on _beforeTokenTransfer
    /// !!! IMPORTANT The Aave governance is considered a trustable contract, being its responsibility
    /// to control all potential reentrancies by calling back the this contract
    ITransferHook public _aaveGovernance;

    event SnapshotDone(address owner, uint128 oldValue, uint128 newValue);

    constructor(string memory name, string memory symbol, uint8 decimals) ERC20(name, symbol, decimals) {}

    function _setAaveGovernance(ITransferHook aaveGovernance) internal virtual {
        _aaveGovernance = aaveGovernance;
    }

    /**
     * @dev Writes a snapshot for an owner of tokens
     * @param owner The owner of the tokens
     * @param oldValue The value before the operation that is gonna be executed after the snapshot
     * @param newValue The value after the operation
     */
    function _writeSnapshot(address owner, uint128 oldValue, uint128 newValue) internal virtual {
        uint128 currentBlock = uint128(block.number);

        uint256 ownerCountOfSnapshots = _countsSnapshots[owner];
        mapping(uint256 => Snapshot) storage snapshotsOwner = _snapshots[owner];

        // Doing multiple operations in the same block
        if (ownerCountOfSnapshots != 0 && snapshotsOwner[ownerCountOfSnapshots - 1].blockNumber == currentBlock) {
            snapshotsOwner[ownerCountOfSnapshots - (1)].value = newValue;
        } else {
            snapshotsOwner[ownerCountOfSnapshots] = Snapshot(currentBlock, newValue);
            _countsSnapshots[owner] = ownerCountOfSnapshots + (1);
        }

        emit SnapshotDone(owner, oldValue, newValue);
    }

    /**
     * @dev Writes a snapshot before any operation involving transfer of value: _transfer, _mint and _burn
     * - On _transfer, it writes snapshots for both "from" and "to"
     * - On _mint, only for _to
     * - On _burn, only for _from
     * @param from the from address
     * @param to the to address
     * @param amount the amount to transfer
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        if (from == to) {
            return;
        }

        if (from != address(0)) {
            uint256 fromBalance = balanceOf(from);
            _writeSnapshot(from, uint128(fromBalance), uint128(fromBalance - (amount)));
        }
        if (to != address(0)) {
            uint256 toBalance = balanceOf(to);
            _writeSnapshot(to, uint128(toBalance), uint128(toBalance + (amount)));
        }

        // caching the aave governance address to avoid multiple state loads
        ITransferHook aaveGovernance = _aaveGovernance;
        if (aaveGovernance != ITransferHook(address(0))) {
            aaveGovernance.onTransfer(from, to, amount);
        }
    }
}

/**
 * @dev Collection of functions related to the address type
 * From https://github.com/OpenZeppelin/openzeppelin-contracts
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            codehash := extcodehash(account)
        }
        return (codehash != accountHash && codehash != 0x0);
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success,) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}

/**
 * @title SafeERC20
 * @dev From https://github.com/OpenZeppelin/openzeppelin-contracts
 * Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function callOptionalReturn(IERC20 token, bytes memory data) private {
        require(address(token).isContract(), "SafeERC20: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "SafeERC20: low-level call failed");

        if (returndata.length > 0) {
            // Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

/**
 * Minimal interface for StakedToken
 * @title StakedToken
 * @notice Contract to stake Aave token, tokenize the position and get rewards, inheriting from a distribution manager contract
 * @author this was adapted from Aave's interface available at https://etherscan.io/token/0x4da27a545c0c5b758a6ba100e3a049001de870f5?a=0xCDc3DD86C99b58749de0F697dfc1ABE4bE22216d#code#F27#L98
 *
 */
abstract contract StakedToken is IStakedAave, ERC20WithSnapshot, VersionedInitializable, AaveDistributionManager {
    using SafeERC20 for IERC20;

    IERC20 public immutable STAKED_TOKEN;
    IERC20 public immutable REWARD_TOKEN;
    uint256 public immutable COOLDOWN_SECONDS;

    /// @notice Seconds available to redeem once the cooldown period is fullfilled
    uint256 public immutable UNSTAKE_WINDOW;

    /// @notice Address to pull from the rewards, needs to have approved this contract
    address public immutable REWARDS_VAULT;

    mapping(address => uint256) public stakerRewardsToClaim;
    mapping(address => uint256) public stakersCooldowns;

    event Staked(address indexed from, address indexed onBehalfOf, uint256 amount);
    event Redeem(address indexed from, address indexed to, uint256 amount);

    event RewardsAccrued(address user, uint256 amount);
    event RewardsClaimed(address indexed from, address indexed to, uint256 amount);

    event Cooldown(address indexed user);

    constructor(
        IERC20 stakedToken,
        IERC20 rewardToken,
        uint256 cooldownSeconds,
        uint256 unstakeWindow,
        address rewardsVault,
        address emissionManager,
        uint128 distributionDuration,
        string memory name,
        string memory symbol,
        uint8 decimals
    ) ERC20WithSnapshot(name, symbol, decimals) AaveDistributionManager(emissionManager, distributionDuration) {
        STAKED_TOKEN = stakedToken;
        REWARD_TOKEN = rewardToken;
        COOLDOWN_SECONDS = cooldownSeconds;
        UNSTAKE_WINDOW = unstakeWindow;
        REWARDS_VAULT = rewardsVault;
    }

    /**
     * @dev Called by the proxy contract
     *
     */
    function initialize(ITransferHook aaveGovernance, string calldata name, string calldata symbol, uint8 decimals)
        external
        initializer
    {
        _setName(name);
        _setSymbol(symbol);
        _setDecimals(decimals);
        _setAaveGovernance(aaveGovernance);
    }

    function stake(address onBehalfOf, uint256 amount) external override {
        require(amount != 0, "INVALID_ZERO_AMOUNT");
        uint256 balanceOfUser = balanceOf(onBehalfOf);

        uint256 accruedRewards = _updateUserAssetInternal(onBehalfOf, address(this), balanceOfUser, totalSupply());
        if (accruedRewards != 0) {
            emit RewardsAccrued(onBehalfOf, accruedRewards);
            stakerRewardsToClaim[onBehalfOf] = stakerRewardsToClaim[onBehalfOf] + (accruedRewards);
        }

        stakersCooldowns[onBehalfOf] = getNextCooldownTimestamp(0, amount, onBehalfOf, balanceOfUser);

        _mint(onBehalfOf, amount);
        IERC20(STAKED_TOKEN).safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, onBehalfOf, amount);
    }

    /**
     * @dev Redeems staked tokens, and stop earning rewards
     * @param to Address to redeem to
     * @param amount Amount to redeem
     *
     */
    function redeem(address to, uint256 amount) external override {
        require(amount != 0, "INVALID_ZERO_AMOUNT");
        //solium-disable-next-line
        uint256 cooldownStartTimestamp = stakersCooldowns[msg.sender];
        require(block.timestamp > cooldownStartTimestamp + (COOLDOWN_SECONDS), "INSUFFICIENT_COOLDOWN");
        require(
            block.timestamp - (cooldownStartTimestamp + (COOLDOWN_SECONDS)) <= UNSTAKE_WINDOW, "UNSTAKE_WINDOW_FINISHED"
        );
        uint256 balanceOfMessageSender = balanceOf(msg.sender);

        uint256 amountToRedeem = (amount > balanceOfMessageSender) ? balanceOfMessageSender : amount;

        _updateCurrentUnclaimedRewards(msg.sender, balanceOfMessageSender, true);

        _burn(msg.sender, amountToRedeem);

        if (balanceOfMessageSender - (amountToRedeem) == 0) {
            stakersCooldowns[msg.sender] = 0;
        }

        IERC20(STAKED_TOKEN).safeTransfer(to, amountToRedeem);

        emit Redeem(msg.sender, to, amountToRedeem);
    }

    /**
     * @dev Activates the cooldown period to unstake
     * - It can't be called if the user is not staking
     *
     */
    function cooldown() external override {
        require(balanceOf(msg.sender) != 0, "INVALID_BALANCE_ON_COOLDOWN");
        //solium-disable-next-line
        stakersCooldowns[msg.sender] = block.timestamp;

        emit Cooldown(msg.sender);
    }

    /**
     * @dev Claims an `amount` of `REWARD_TOKEN` to the address `to`
     * @param to Address to stake for
     * @param amount Amount to stake
     *
     */
    function claimRewards(address to, uint256 amount) external override {
        uint256 newTotalRewards = _updateCurrentUnclaimedRewards(msg.sender, balanceOf(msg.sender), false);
        uint256 amountToClaim = (amount == type(uint256).max) ? newTotalRewards : amount;

        stakerRewardsToClaim[msg.sender] = 0;

        REWARD_TOKEN.safeTransferFrom(REWARDS_VAULT, to, amountToClaim);

        emit RewardsClaimed(msg.sender, to, amountToClaim);
    }

    /**
     * @dev Internal ERC20 _transfer of the tokenized staked tokens
     * @param from Address to transfer from
     * @param to Address to transfer to
     * @param amount Amount to transfer
     *
     */
    function _transfer(address from, address to, uint256 amount) internal override {
        uint256 balanceOfFrom = balanceOf(from);
        // Sender
        _updateCurrentUnclaimedRewards(from, balanceOfFrom, true);

        // Recipient
        if (from != to) {
            uint256 balanceOfTo = balanceOf(to);
            _updateCurrentUnclaimedRewards(to, balanceOfTo, true);

            uint256 previousSenderCooldown = stakersCooldowns[from];
            stakersCooldowns[to] = getNextCooldownTimestamp(previousSenderCooldown, amount, to, balanceOfTo);
            // if cooldown was set and whole balance of sender was transferred - clear cooldown
            if (balanceOfFrom == amount && previousSenderCooldown != 0) {
                stakersCooldowns[from] = 0;
            }
        }

        super._transfer(from, to, amount);
    }

    /**
     * @dev Updates the user state related with his accrued rewards
     * @param user Address of the user
     * @param userBalance The current balance of the user
     * @param updateStorage Boolean flag used to update or not the stakerRewardsToClaim of the user
     * @return The unclaimed rewards that were added to the total accrued
     *
     */
    function _updateCurrentUnclaimedRewards(address user, uint256 userBalance, bool updateStorage)
        internal
        returns (uint256)
    {
        uint256 accruedRewards = _updateUserAssetInternal(user, address(this), userBalance, totalSupply());
        uint256 unclaimedRewards = stakerRewardsToClaim[user] + (accruedRewards);

        if (accruedRewards != 0) {
            if (updateStorage) {
                stakerRewardsToClaim[user] = unclaimedRewards;
            }
            emit RewardsAccrued(user, accruedRewards);
        }

        return unclaimedRewards;
    }

    /**
     * @dev Calculates the how is gonna be a new cooldown timestamp depending on the sender/receiver situation
     *  - If the timestamp of the sender is "better" or the timestamp of the recipient is 0, we take the one of the recipient
     *  - Weighted average of from/to cooldown timestamps if:
     *    # The sender doesn't have the cooldown activated (timestamp 0).
     *    # The sender timestamp is expired
     *    # The sender has a "worse" timestamp
     *  - If the receiver's cooldown timestamp expired (too old), the next is 0
     * @param fromCooldownTimestamp Cooldown timestamp of the sender
     * @param amountToReceive Amount
     * @param toAddress Address of the recipient
     * @param toBalance Current balance of the receiver
     * @return The new cooldown timestamp
     *
     */
    function getNextCooldownTimestamp(
        uint256 fromCooldownTimestamp,
        uint256 amountToReceive,
        address toAddress,
        uint256 toBalance
    ) public returns (uint256) {
        uint256 toCooldownTimestamp = stakersCooldowns[toAddress];
        if (toCooldownTimestamp == 0) {
            return 0;
        }

        uint256 minimalValidCooldownTimestamp = block.timestamp - (COOLDOWN_SECONDS) - (UNSTAKE_WINDOW);

        if (minimalValidCooldownTimestamp > toCooldownTimestamp) {
            toCooldownTimestamp = 0;
        } else {
            uint256 bfromCooldownTimestamp =
                (minimalValidCooldownTimestamp > fromCooldownTimestamp) ? block.timestamp : fromCooldownTimestamp;

            if (bfromCooldownTimestamp < toCooldownTimestamp) {
                return toCooldownTimestamp;
            } else {
                toCooldownTimestamp = (amountToReceive * (bfromCooldownTimestamp) + (toBalance * (toCooldownTimestamp)))
                    / (amountToReceive + toBalance);
            }
        }
        stakersCooldowns[toAddress] = toCooldownTimestamp;

        return toCooldownTimestamp;
    }

    /**
     * @dev Return the total rewards pending to claim by an staker
     * @param staker The staker address
     * @return The rewards
     */
    function getTotalRewardsBalance(address staker) external view returns (uint256) {
        DistributionTypes.UserStakeInput[] memory userStakeInputs = new DistributionTypes.UserStakeInput[](1);
        userStakeInputs[0] = DistributionTypes.UserStakeInput({
            underlyingAsset: address(this),
            stakedByUser: balanceOf(staker),
            totalStaked: totalSupply()
        });
        return stakerRewardsToClaim[staker] + _getUnclaimedRewards(staker, userStakeInputs);
    }

    /**
     * @dev returns the revision of the implementation contract
     * @return The revision
     */
    function getRevision() internal pure override returns (uint256) {
        return 0;
    }
}
