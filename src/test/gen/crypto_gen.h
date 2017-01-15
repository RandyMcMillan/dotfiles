#ifndef BITCOIN_TEST_GEN_CRYPTO_GEN_H
#define BITCOIN_TEST_GEN_CRYPTO_GEN_H

#include "key.h"
#include "random.h" 
#include "uint256.h" 
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>

namespace rc {  

  /** Generator for a new CKey */
  template<>
  struct Arbitrary<CKey> {
    static Gen<CKey> arbitrary() {
      return gen::map<int>([](int x) { 
        CKey key;  
        key.MakeNewKey(true);
        return key; 
      });
    };
  };
  
  /** Generator for a CPrivKey */ 
  template<> 
  struct Arbitrary<CPrivKey> { 
    static Gen<CPrivKey> arbitrary() { 
      return gen::map<CKey>([](CKey key) { 
        return key.GetPrivKey();
      });
    }; 
  };

  /** Generator for a new CPubKey */
  template<>
  struct Arbitrary<CPubKey> {
    static Gen<CPubKey> arbitrary() {
      return gen::map<CKey>([](CKey key) {
        return key.GetPubKey(); 
      });
    };
  };
  
  /** Generates a arbitrary uint256 */
  template<> 
  struct Arbitrary<uint256> { 
    static Gen<uint256> arbitrary() { 
      return gen::map<int>([](int x) { 
        return GetRandHash(); 
      }); 
    }; 
  }; 
}
#endif
