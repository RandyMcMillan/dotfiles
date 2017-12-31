#include "test/gen/script_gen.h"

#include "test/gen/crypto_gen.h"
#include "script/script.h"
#include "script/standard.h"
#include "base58.h"
#include "core_io.h"
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include <rapidcheck/gen/Predicate.h>
#include <rapidcheck/gen/Numeric.h>

/** Generates a P2PK/CKey pair */
rc::Gen<SPKCKeyTup> P2PKSPK() {
  return rc::gen::map(rc::gen::arbitrary<CKey>(), [](CKey key) {
    const CScript& s = GetScriptForRawPubKey(key.GetPubKey());
    std::vector<CKey> keys;
    keys.push_back(key);
    return std::make_tuple(s,keys);
  });
}
/** Generates a P2PKH/CKey pair */
rc::Gen<SPKCKeyTup> P2PKHSPK() {
  return rc::gen::map(rc::gen::arbitrary<CKey>(), [](CKey key) {
    CKeyID id = key.GetPubKey().GetID(); 
    std::vector<CKey> keys;
    keys.push_back(key);
    const CScript& s = GetScriptForDestination(id);
    return std::make_tuple(s,keys);
  });
}

/** Generates a MultiSigSPK/CKey(s) pair */
rc::Gen<SPKCKeyTup> MultisigSPK() {
  return rc::gen::mapcat(MultisigKeys(), [](std::vector<CKey> keys) {
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

rc::Gen<SPKCKeyTup> RawSPK() {
  return rc::gen::oneOf(P2PKSPK(), P2PKHSPK(), MultisigSPK(),
    P2WPKHSPK());
}

/** Generates a P2SHSPK/CKey(s) */
rc::Gen<SPKCKeyTup> P2SHSPK() {
  return rc::gen::map(RawSPK(), [](SPKCKeyTup spk_keys) {
    const CScript redeemScript = std::get<0>(spk_keys);
    const std::vector<CKey> keys = std::get<1>(spk_keys);
    const CScript p2sh = GetScriptForDestination(CScriptID(redeemScript));
    return std::make_tuple(redeemScript,keys);
  });
}

//witness SPKs

rc::Gen<SPKCKeyTup> P2WPKHSPK() {
  rc::Gen<SPKCKeyTup> spks = rc::gen::oneOf(P2PKSPK(),P2PKHSPK());
  return rc::gen::map(spks, [](SPKCKeyTup spk_keys) {
    const CScript p2pk = std::get<0>(spk_keys);
    const std::vector<CKey> keys = std::get<1>(spk_keys);
    const CScript witSPK = GetScriptForWitness(p2pk);
    return std::make_tuple(witSPK, keys);
  });
}

rc::Gen<SPKCKeyTup> P2WSHSPK() {
  return rc::gen::map(MultisigSPK(), [](SPKCKeyTup spk_keys) {
    const CScript p2pk = std::get<0>(spk_keys);
    const std::vector<CKey> keys = std::get<1>(spk_keys);
    const CScript witSPK = GetScriptForWitness(p2pk);
    return std::make_tuple(witSPK, keys);
  });
}
