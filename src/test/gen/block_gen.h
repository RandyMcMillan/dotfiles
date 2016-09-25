#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include "primitives/block.h"
#include "uint256.h"
#include "test/gen/crypto_gen.h" 
namespace rc {

  Gen<std::tuple<int32_t, uint256, uint256, uint32_t, uint32_t, uint32_t>> blockHeaderPrimitives = gen::tuple(gen::arbitrary<int32_t>(), 
      gen::arbitrary<uint256>(), gen::arbitrary<uint256>(), 
      gen::arbitrary<uint32_t>(), gen::arbitrary<uint32_t>(), gen::arbitrary<uint32_t>());

  /** Generator for a new CBlockHeader */
  template<>
  struct Arbitrary<CBlockHeader> { 
    static Gen<CBlockHeader> arbitrary() { 
      return gen::map(blockHeaderPrimitives, [](std::tuple<int32_t, uint256, uint256, uint32_t, uint32_t, uint32_t> headerPrimitives) {  
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
}
