#include "test/gen/bloom_gen.h"
#include "test/gen/crypto_gen.h" 

#include "bloom.h"
#include <math.h>

#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include <rapidcheck/gen/Tuple.h>
#include <rapidcheck/gen/Predicate.h>
#include <rapidcheck/gen/Numeric.h>
#include <rapidcheck/gen/Container.h>

/** Generates a double between [0,1) */
rc::Gen<double> BetweenZeroAndOne() {
  return rc::gen::map(rc::gen::arbitrary<double>(), [](double x) {
    double result = abs(fmod(x,1));
    assert(result >= 0 && result < 1);
    return result;
  }); 
}

rc::Gen<unsigned int> Between1And100() {
  return rc::gen::map(rc::gen::arbitrary<unsigned int>(), [](unsigned int x) {
    return x % 100;
  });
}
  /** Generates the C++ primitives used to create a bloom filter */
rc::Gen<std::tuple<unsigned int, double, unsigned int, unsigned int>> BloomFilterPrimitives() {
  return rc::gen::tuple(rc::gen::inRange<unsigned int>(1,100),
    BetweenZeroAndOne(),rc::gen::arbitrary<unsigned int>(),
    rc::gen::inRange<unsigned int>(0,3));
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
