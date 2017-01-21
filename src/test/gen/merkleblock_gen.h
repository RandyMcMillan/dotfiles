#ifndef BITCOIN_TEST_GEN_MERKLEBLOCK_GEN_H
#define BITCOIN_TEST_GEN_MERKLEBLOCK_GEN_H

#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>

#include "merkleblock.h"
#include "test/gen/block_gen.h"
namespace rc {

  template<>
  struct Arbitrary<CMerkleBlock> { 
    static Gen<CMerkleBlock> arbitrary() {
      return gen::map(gen::arbitrary<CBlock>(), [](CBlock block) {
        std::set<uint256> hashes;
        for(unsigned int i = 0; i < block.vtx.size(); i++) {
          //pretty naive to include every other txid in the merkle block
          //but this will work for now.
          if (i % 2 == 0) {
            hashes.insert(block.vtx[i]->GetHash());
           }
        }
        return CMerkleBlock(block,hashes);
      });
    };
  };

}
#endif
