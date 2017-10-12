#ifndef BITCOIN_TEST_GEN_SCRIPT_GEN_H
#define BITCOIN_TEST_GEN_SCRIPT_GEN_H

#include "script/script.h"
#include "key.h"
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include <rapidcheck/gen/Numeric.h>
#include <rapidcheck/gen/Container.h>
#include <rapidcheck/gen/Select.h>

typedef std::tuple<CScript, std::vector<CKey>> T;

//non witness SPKs
rc::Gen<T> P2PKSPK();

rc::Gen<T> P2PKHSPK();

rc::Gen<T> MultisigSPK();

/** Generates a non-P2SH/P2WSH spk */
rc::Gen<T> RawSPK();

rc::Gen<T> P2SHSPK();

//witness spks

rc::Gen<T> P2WPKHSPK();

rc::Gen<T> P2WSHSPK();

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
