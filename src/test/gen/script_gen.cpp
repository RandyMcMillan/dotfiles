#include "test/gen/script_gen.h"

#include "test/gen/crypto_gen.h"
#include "script/script.h"
#include "script/standard.h"
#include "base58.h"
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include <rapidcheck/gen/Predicate.h>
#include <rapidcheck/gen/Numeric.h>

/** Generates a P2PK/CKey pair */
rc::Gen<T> P2PKSPK() {
  return rc::gen::map(rc::gen::arbitrary<CKey>(), [](CKey key) {
    const CScript& s = GetScriptForRawPubKey(key.GetPubKey());
    std::vector<CKey> keys;
    keys.push_back(key);
    T tup = std::make_tuple(s,keys);
    return tup;
  });
}
/** Generates a P2PKH/CKey pair */
rc::Gen<T> P2PKHSPK() {
  return rc::gen::map(rc::gen::arbitrary<CKey>(), [](CKey key) {
    CKeyID id = key.GetPubKey().GetID(); 
    std::vector<CKey> keys;
    keys.push_back(key);
    const CScript& s = GetScriptForDestination(id);
    return std::make_tuple(s,keys);
  });
}

/** Generates a MultiSigSPK/CKey(s) pair */
rc::Gen<T> MultisigSPK() {
  return rc::gen::mapcat(multisigKeys(), [](std::vector<CKey> keys) {
    return rc::gen::map(rc::gen::inRange<int>(1,keys.size()),[keys](int requiredSigs) {
      std::vector<CPubKey> pubKeys;
      for(unsigned int i = 0; i < keys.size(); i++) {
        pubKeys.push_back(keys[i].GetPubKey());
      }
      const CScript& s = GetScriptForMultisig(requiredSigs,pubKeys);
      return std::make_tuple(s,keys);
    });
  });
}
