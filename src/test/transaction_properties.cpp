#include "key.h"

#include "base58.h"
#include "script/script.h"
#include "uint256.h"
#include "util.h"
#include "utilstrencodings.h"
#include "test/test_bitcoin.h"
#include "streams.h"
#include <string>
#include <vector>

#include <boost/test/unit_test.hpp>
#include <rapidcheck/boost_test.h>
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include "test/gen/transaction_gen.h"

BOOST_FIXTURE_TEST_SUITE(transaction_properties, BasicTestingSetup)

/** Check COutpoint serialization symmetry */ 
RC_BOOST_PROP(outpoint_serialization_symmetry, (COutPoint outpoint)) {
  CDataStream ss(SER_NETWORK, PROTOCOL_VERSION);
  ss << outpoint;
  COutPoint outpoint2; 
  ss >> outpoint2;
  RC_ASSERT(outpoint2 == outpoint); 
}
/** Check CTxIn serialization symmetry */
RC_BOOST_PROP(ctxin_serialization_symmetry, (CTxIn txIn)) {
  CDataStream ss(SER_NETWORK, PROTOCOL_VERSION);
  ss << txIn;
  CTxIn txIn2; 
  ss >> txIn2;
  RC_ASSERT(txIn == txIn2); 
}

/** Check CTxOut serialization symmetry */
RC_BOOST_PROP(ctxout_serialization_symmetry, (CTxOut txOut)) {
  CDataStream ss(SER_NETWORK, PROTOCOL_VERSION);
  ss << txOut;
  CTxOut txOut2;
  ss >> txOut2;
  RC_ASSERT(txOut == txOut2); 
}

/** Check CTransaction serialization symmetry */
RC_BOOST_PROP(ctransaction_serialization_symmetry, (CTransaction tx)) {
  CDataStream ss(SER_NETWORK, PROTOCOL_VERSION);
  ss << tx;
  deserialize_type t; 
  CTransaction tx2(t,ss);
  RC_ASSERT(tx == tx2);
}

BOOST_AUTO_TEST_SUITE_END()
