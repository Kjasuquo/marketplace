// contracts/MarketplaceNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor()
        ERC721("MarketplaceNFT", "MPNFT")
        Ownable(msg.sender)
    {}

    function mint(address to, string memory uri) external onlyOwner {
        _mint(to, nextTokenId);
        _setTokenURI(nextTokenId, uri);
        nextTokenId++;
    }

    function transferNFT(address from, address to, uint256 tokenId) external {
        require(msg.sender == from, "Not owner");
        safeTransferFrom(from, to, tokenId);
    }

    // REQUIRED OVERRIDES
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}