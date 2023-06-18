// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {TransferHelper} from "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SwapAdapter} from "./Swap/SwapAdapter.sol";

contract SwapAndXCall is SwapAdapter {

    /**
     * @notice Sets up the swap and returns the amount out
     * @dev Handles approvals to the connext contract and the swapper contract
     * @param _fromAsset Address of the asset to swap from
     * @param _toAsset Address of the asset to swap to
     * @param _amountIn Amount of the asset to swap from
     * @param _swapper Address of the swapper contract
     * @param _swapData Data to call the swapper contract with
     * @return amountOut Amount of the asset after swap
     */
    function _setupAndSwap(
        address _fromAsset,
        address _toAsset,
        uint256 _amountIn,
        address _swapper,
        bytes calldata _swapData
    ) internal returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(_fromAsset, msg.sender, address(this), _amountIn);

        if (_fromAsset != _toAsset) {
            require(_swapper != address(0), "SwapAndXCall: zero swapper!");

            // If fromAsset is not native and allowance is less than amountIn
            if (IERC20(_fromAsset).allowance(address(this), _swapper) < _amountIn) {
                TransferHelper.safeApprove(_fromAsset, _swapper, type(uint256).max);
            }

            amountOut = this.directSwapperCall(_swapper, _swapData);
        } else {
            amountOut = _amountIn;
        }

        if (_toAsset != address(0)) {
            if (IERC20(_toAsset).allowance(address(this), address(connext)) < amountOut) {
                TransferHelper.safeApprove(_toAsset, address(connext), type(uint256).max);
            }
        }
    }

    /**
     * @notice Sets up the swap and returns the amount out
     * @dev Handles approvals to the connext contract and the swapper contract
     * @param _toAsset Address of the asset to swap to
     * @param _amountIn Amount of the asset to swap from
     * @param _swapper Address of the swapper contract
     * @param _swapData Data to call the swapper contract with
     * @return amountOut Amount of the asset after swap
     */
    function _setupAndSwapETH(address _toAsset, uint256 _amountIn, address _swapper, bytes calldata _swapData)
        internal
        returns (uint256 amountOut)
    {
        require(msg.value >= _amountIn, "SwapAndXCall: msg.value != _amountIn");

        if (_toAsset != address(0)) {
            require(_swapper != address(0), "SwapAndXCall: zero swapper!");
            amountOut = this.directSwapperCall{value: _amountIn}(_swapper, _swapData);

            if (IERC20(_toAsset).allowance(address(this), address(connext)) < amountOut) {
                TransferHelper.safeApprove(_toAsset, address(connext), type(uint256).max);
            }
        } else {
            amountOut = _amountIn;
        }
    }
}
