#ifndef BITCOIN_TEST_GEN_MERKLEBLOCK_GEN_H
#define BITCOIN_TEST_GEN_MERKLEBLOCK_GEN_H

#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>

#include "merkleblock.h"
#include "test/gen/block_gen.h"

#include <iostream>
namespace rc {
  /** Returns a CMerkleblock with the hashes that match inside of the CPartialMerkleTree */
  template<>
  struct Arbitrary<std::pair<CMerkleBlock, std::set<uint256>>> { 
    static Gen<std::pair<CMerkleBlock,std::set<uint256>>> arbitrary() {
      return gen::map(gen::arbitrary<CBlock>(), [](CBlock block) {
        std::set<uint256> hashes;
        for(unsigned int i = 0; i < block.vtx.size(); i++) {
          //pretty naive to include every other txid in the merkle block
          //but this will work for now.
          if (i % 2 == 0) {
            hashes.insert(block.vtx[i]->GetHash());
           }
        }
        return std::make_pair(CMerkleBlock(block,hashes),hashes);
      });
    };
  };


  Gen<std::vector<uint256>> betweenZeroAnd100 = gen::suchThat<std::vector<uint256>>([](std::vector<uint256> hashes) {
    return hashes.size() <= 100; 
  }); 
  
  /** Returns an arbitrary CMerkleBlock */
  template<>
  struct Arbitrary<CMerkleBlock> { 
    static Gen<CMerkleBlock> arbitrary() {
      return gen::map(gen::arbitrary<std::pair<CMerkleBlock, std::set<uint256>>>(), 
          [](std::pair<CMerkleBlock, std::set<uint256>> merkleBlockWithTxIds) {
        CMerkleBlock merkleBlock = merkleBlockWithTxIds.first;
        std::set<uint256> insertedHashes = merkleBlockWithTxIds.second; 
        return merkleBlock; 
      });
    };
  };



  /** Generates a CPartialMerkleTree and returns the PartialMerkleTree along 
   * with the txids that should be matched inside of it */
  template<>
  struct Arbitrary<std::pair<CPartialMerkleTree, std::vector<uint256>>> {
    static Gen<std::pair<CPartialMerkleTree, std::vector<uint256>>> arbitrary() {
      return gen::map(gen::arbitrary<std::vector<uint256>>(), [](std::vector<uint256> txids) {
        //note this use of 'gen::nonEmpty' above, if we have an empty vector of txids
        //we will get a memory access violation when calling the CPartialMerkleTree 
        //constructor below. On one hand we shouldn't every have CPartialMerkleTree 
        //with no txids, but on the other hand, it seems we should call 
        //CPartialMerkleTree() inside of CPartialMerkleTree(txids,matches)
        //if we have zero txids. 
        //Some one who knows more than me will have to elaborate if the memory access violation
        //is a desirable failure mode or not...
        std::vector<bool> matches;
        std::vector<uint256> matchedTxs;  
        for(unsigned int i = 0; i < txids.size(); i++) {
          //pretty naive to include every other txid in the merkle block
          //but this will work for now.
          matches.push_back(i % 2 == 1);
          if (i % 2 == 1) { 
            matchedTxs.push_back(txids[i]);  
          }
        }
        return std::make_pair(CPartialMerkleTree(txids,matches),matchedTxs);
      });
    };
  };

  template<>
  struct Arbitrary<CPartialMerkleTree> {
    static Gen<CPartialMerkleTree> arbitrary() {
      return gen::map(gen::arbitrary<std::pair<CPartialMerkleTree,std::vector<uint256>>>(),
        [](std::pair<CPartialMerkleTree,std::vector<uint256>> p) { 
         return p.first;
      });
    };
  };
}
#endif
