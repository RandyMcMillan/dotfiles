#ifndef BITCOIN_TEST_GEN_SCRIPT_GEN_H
#define BITCOIN_TEST_GEN_SCRIPT_GEN_H

#include "script/script.h"
#include "key.h"
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include <rapidcheck/gen/Numeric.h>
#include <rapidcheck/gen/Container.h>

typedef std::tuple<CScript, std::vector<CKey>> T;

rc::Gen<T> P2PKSPK();

rc::Gen<T> P2PKHSPK();

rc::Gen<T> MultisigSPK();

namespace rc {
  
  template<>
  struct Arbitrary<CScript> {
    static Gen<CScript> arbitrary() {
      return gen::map(gen::arbitrary<std::vector<unsigned char>>(), [](std::vector<unsigned char> script) {
        return CScript(script);
      });
    };
  };
}
#endif
