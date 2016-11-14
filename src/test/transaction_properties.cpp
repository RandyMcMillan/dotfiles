#include "key.h"

#include "base58.h"
#include "script/script.h"
#include "uint256.h"
#include "util.h"
#include "utilstrencodings.h"
#include "test/test_bitcoin.h"
#include <string>
#include <vector>

#include <boost/test/unit_test.hpp>
#include <rapidcheck/boost_test.h>
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>

#include "test/gen/transaction_gen.h"

BOOST_FIXTURE_TEST_SUITE(transaction_properties, BasicTestingSetup)

/** Check CKey uniqueness */ 
RC_BOOST_PROP(outpoint_serialization_symmetry, (COutPoint outpoint)) {
  CDataStream ss(SER_NETWORK, PROTOCOL_VERSION);
  ss << outpoint;
  COutPoint outpoint2; 
  ss >> outpoint2;
  RC_ASSERT(outpoint2 == outpoint); 
}

BOOST_AUTO_TEST_SUITE_END()
