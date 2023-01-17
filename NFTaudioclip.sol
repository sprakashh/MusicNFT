// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";


contract NFTaudioclip is ERC721,  ERC721URIStorage, ERC721Burnable, Ownable {
   using Counters for Counters.Counter;
   Counters.Counter private _tokencount;
   string[] uricollection;
   mapping(uint=>uint) profit;
   uint trackcount=0;
   mapping(uint=>address) public contributors;
   uint tokenID;
   constructor() ERC721("MyToken","MT")
   {}

   function MintNFT(address to, string memory uri) public onlyOwner
   {
       uricollection.push(uri);
       ++trackcount;
       uricollection.push(uri);
       tokenID=_tokencount.current();
       _tokencount.increment();
       _safeMint(to,tokenID);
       _setTokenURI(tokenID,uri);

   }

    function getTokenUris() public view returns(string[] memory)
    {
        return uricollection;


    }


   function Playmusic(uint  token_ID) public payable
 {
     if(contributors[token_ID]==msg.sender)
     {
          require(msg.value <= 0 ether);
       
     }
     else
     {
     require(msg.value >= 0.01 ether);
     contributors[token_ID]=msg.sender;
     profit[token_ID]+=msg.value;
     }


 }

    function getProfit(uint  token_ID) public view returns(uint)
    {

        return(profit[token_ID]);


    }

    function getTotaltokens() public view returns(uint)
    {
        require(trackcount !=0,"no tokens created");
        return trackcount;        

    }

    //overrides required by solidity
    function _burn(uint256 _tokenID) internal override(ERC721,ERC721URIStorage)
    {
        super._burn(_tokenID);

    }

    function tokenURI(uint256 _tokenID)
    public view override(ERC721,ERC721URIStorage)
    returns(string memory)
    {
        return super.tokenURI(_tokenID);

    }


    //for owner to withdraw funds

    function withdrawfunds() public onlyOwner
    {
        
        payable(owner()).transfer(address(this).balance);
        

    }



}
