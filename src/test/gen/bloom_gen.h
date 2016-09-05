#include <math.h>
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include "bloom.h" 
namespace rc {
  /** Generates a double between 0,1 exclusive */
  Gen<double> betweenZeroAndOne = gen::suchThat<double>([](double x) {
        return fmod(x,1) != 0;
      }); 
  /** Generates the C++ primitives used to create a bloom filter */
  Gen<std::tuple<unsigned int, double, unsigned int, unsigned int>> bloomFilterPrimitives = gen::tuple(gen::inRange<unsigned int>(1,100),
                                           betweenZeroAndOne,
                                           gen::arbitrary<unsigned int>(),
                                           gen::inRange<unsigned int>(0,3));
  
  /** Generator for a new CBloomFilter*/
  template<>
  struct Arbitrary<CBloomFilter> {
    static Gen<CBloomFilter> arbitrary() {
      return gen::map(bloomFilterPrimitives, [](std::tuple<unsigned int, double, unsigned int, unsigned int> filterPrimitives) {   
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
