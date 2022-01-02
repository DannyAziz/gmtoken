// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "openzeppelin-solidity/contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/utils/cryptography/draft-EIP712.sol";
import "./ERC20.sol";

contract GmToken is ERC20, EIP712 {
    uint256 public constant MAX_SUPPLY = uint248(21000000 * (10 ** 18));

    // for devs
    uint256 public constant AMOUNT_DEV = MAX_SUPPLY / 10;    

    // for airdrop
    uint256 public constant AMOUNT_AIRDROP = MAX_SUPPLY - AMOUNT_DEV;

    address public immutable ADDR_DEV;
    address public immutable cSigner;

    constructor(string memory name, string memory symbol, address _signer) ERC20(name, symbol) EIP712(name, "1") {
        _mint(_signer, AMOUNT_DEV);
        cSigner = _signer;
        ADDR_DEV = _signer;
    }

    function claimTokens(uint256 _amount, bytes memory _sig) public {
        uint256 total = totalSupply() + _amount;
        require(total <= MAX_SUPPLY, "Exceed max supply");
        require(minted(msg.sender) == 0, "Claimed already");
        address signer = ECDSA.recover(ECDSA.toEthSignedMessageHash(abi.encode(msg.sender, _amount)), _sig);
        require(signer == cSigner, "invalid signature");
        _mint(msg.sender, _amount * (10 ** uint256(decimals())));
    }

    function tokensLeft() public view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}