#ifndef BITCOIN_TEST_GEN_BLOOM_GEN_H
#define BITCOIN_TEST_GEN_BLOOM_GEN_H

#include "bloom.h"
#include "merkleblock.h"

#include <math.h>

#include <rapidcheck/Gen.h>
#include <rapidcheck/gen/Arbitrary.h>

/** Generates a double between 0,1 exclusive */
rc::Gen<double> BetweenZeroAndOne();

rc::Gen<std::tuple<unsigned int, double, unsigned int, unsigned int>> BloomFilterPrimitives();

namespace rc {
  

  /** Generator for a new CBloomFilter*/
  template<>
  struct Arbitrary<CBloomFilter> {
    static Gen<CBloomFilter> arbitrary() {
      return gen::map(BloomFilterPrimitives(), [](std::tuple<unsigned int, double, unsigned int, unsigned int> filterPrimitives) {   
        unsigned int numElements;  
        double fpRate;
        unsigned int nTweakIn;
        unsigned int bloomFlag; 
        std::tie(numElements, fpRate, nTweakIn, bloomFlag) = filterPrimitives; 
        return CBloomFilter(numElements,fpRate,nTweakIn,bloomFlag);  
      });
    };
  };
}

/** Returns a bloom filter loaded with the given uint256s */ 
rc::Gen<std::tuple<CBloomFilter, std::vector<uint256>>> LoadedBloomFilter();

/** Loads an arbitrary bloom filter with the given hashes */
rc::Gen<std::tuple<CBloomFilter, std::vector<uint256>>> LoadBloomFilter(std::vector<uint256>& hashes);


#endif
