#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include "primitives/transaction.h" 
#include "test/gen/crypto_gen.h" 
namespace rc {
 
  template<>
  struct Arbitrary<COutPoint> {
    static Gen<COutPoint> arbitrary() { 
      return gen::map(gen::tuple(gen::arbitrary<uint256>(), gen::arbitrary<uint32_t>()), [](std::tuple<uint256, uint32_t> outPointPrimitives) {
          uint32_t nIn; 
          uint256 nHashIn; 
          std::tie(nHashIn, nIn) = outPointPrimitives;
          return COutPoint(nHashIn, nIn);
          });
    };
  }; 
}
