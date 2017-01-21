#ifndef BITCOIN_TEST_GEN_BLOCK_GEN_H
#define BITCOIN_TEST_GEN_BLOCK_GEN_H

#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include "primitives/block.h"
#include "uint256.h"
#include "test/gen/crypto_gen.h" 
#include "test/gen/transaction_gen.h" 

/** Generator for the primitives of a block header */
inline rc::Gen<std::tuple<int32_t, uint256, uint256, uint32_t, uint32_t, uint32_t>> blockHeaderPrimitives() { 
  return rc::gen::tuple(rc::gen::arbitrary<int32_t>(), 
    rc::gen::arbitrary<uint256>(), rc::gen::arbitrary<uint256>(), 
    rc::gen::arbitrary<uint32_t>(), rc::gen::arbitrary<uint32_t>(), rc::gen::arbitrary<uint32_t>());
}

namespace rc {

  /** Generator for a new CBlockHeader */
  template<>
  struct Arbitrary<CBlockHeader> {
    static Gen<CBlockHeader> arbitrary() {
      return gen::map(blockHeaderPrimitives(), [](std::tuple<int32_t, uint256, uint256, uint32_t, uint32_t, uint32_t> headerPrimitives) {
        int32_t nVersion;
        uint256 hashPrevBlock;
        uint256 hashMerkleRoot;
        uint32_t nTime;
        uint32_t nBits;
        uint32_t nNonce;
        std::tie(nVersion,hashPrevBlock, hashMerkleRoot, nTime,nBits,nNonce) = headerPrimitives;
        CBlockHeader header; 
        header.nVersion = nVersion;
        header.hashPrevBlock = hashPrevBlock; 
        header.hashMerkleRoot = hashMerkleRoot; 
        header.nTime = nTime; 
        header.nBits = nBits; 
        header.nNonce = nNonce; 
        return header; 
      });
    };
  };
  
  /** Generator for a new CBlock */
  template<>
  struct Arbitrary<CBlock> {
    static Gen<CBlock> arbitrary() {
      return gen::map(gen::nonEmpty<std::vector<CTransactionRef>>(), [](std::vector<CTransactionRef> txRefs) {
        CBlock block;
        block.vtx = txRefs;
        return block;
      });
    }
  };
}
#endif
