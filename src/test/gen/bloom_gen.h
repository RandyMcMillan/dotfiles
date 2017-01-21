#ifndef BITCOIN_TEST_GEN_BLOOM_GEN_H
#define BITCOIN_TEST_GEN_BLOOM_GEN_H
#include <math.h>
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include "bloom.h"
#include "merkleblock.h"
#include "test/gen/transaction_gen.h" 
#include "test/gen/crypto_gen.h" 

/** Generates a double between 0,1 exclusive */
inline rc::Gen<double> BetweenZeroAndOne() {
  return rc::gen::suchThat<double>([](double x) {
    return fmod(x,1) != 0;
  }); 
}
/** Generates the C++ primitives used to create a bloom filter */
inline rc::Gen<std::tuple<unsigned int, double, unsigned int, unsigned int>> BloomFilterPrimitives() {
  return rc::gen::tuple(rc::gen::inRange<unsigned int>(1,100),
    BetweenZeroAndOne(),rc::gen::arbitrary<unsigned int>(),
    rc::gen::inRange<unsigned int>(0,3));
}

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
rc::Gen<std::tuple<CBloomFilter, std::vector<uint256>>> LoadedBloomFilter() {
  return rc::gen::map(rc::gen::tuple(rc::gen::arbitrary<CBloomFilter>(),rc::gen::arbitrary<std::vector<uint256>>()),
      [](std::tuple<CBloomFilter, std::vector<uint256>> primitives) {
    std::vector<uint256> hashes;
    CBloomFilter bloomFilter;
    std::tie(bloomFilter,hashes) = primitives;
    for(unsigned int i = 0; i < hashes.size(); i++) {
      bloomFilter.insert(hashes[i]);
    }
    return std::make_tuple(bloomFilter,hashes);
  });
}

/** Loads an arbitrary bloom filter with the given hashes */
rc::Gen<std::tuple<CBloomFilter, std::vector<uint256>>> LoadBloomFilter(std::vector<uint256>& hashes) {
  return rc::gen::map(rc::gen::arbitrary<CBloomFilter>(),[&hashes](CBloomFilter bloomFilter) {
    for(unsigned int i = 0; i < hashes.size(); i++) {
      bloomFilter.insert(hashes[i]);
    }
    return std::make_tuple(bloomFilter,hashes); 
  });
}
#endif
