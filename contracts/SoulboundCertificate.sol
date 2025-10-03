// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SoulboundCertificate
 * @dev ERC721 NFT for non-transferable (soulbound) student certificates.
 * Adds ERC721Enumerable so wallets/students can enumerate owned certificates.
 */
contract SoulboundCertificate is ERC721URIStorage, ERC721Enumerable, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => bool) public validCertificates;

    event CertificateMinted(address indexed student, uint256 indexed tokenId, string metadataURI);

    constructor() ERC721("SoulboundCertificate", "SBCERT") {}

    /**
     * @dev Mint a new soulbound certificate NFT to a student
     * @param student The address of the student
     * @param metadataURI The URI pointing to the certificate metadata (IPFS)
     */
    function mintCertificate(address student, string memory metadataURI) external onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, metadataURI);
        validCertificates[tokenId] = true;
        nextTokenId++;
        emit CertificateMinted(student, tokenId, metadataURI);
    }

    /**
     * @dev Verify if a certificate is valid (exists and not revoked)
     * @param tokenId The certificate tokenId
     */
    function verifyCertificate(uint256 tokenId) external view returns (bool) {
        return validCertificates[tokenId] && _exists(tokenId);
    }

    /**
     * @dev Prevent transfer of soulbound NFTs (non-transferable)
     * and maintain enumeration hooks.
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        require(from == address(0) || to == address(0), "Soulbound: non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Optionally allow revocation of certificates by contract owner
     */
    function revokeCertificate(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        validCertificates[tokenId] = false;
    }
}
