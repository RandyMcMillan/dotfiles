#include "test/test_bitcoin.h"

#include <boost/test/unit_test.hpp>
#include <rapidcheck/boost_test.h>
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>

#include "merkleblock.h"
#include "test/gen/merkleblock_gen.h"

BOOST_FIXTURE_TEST_SUITE(merkleblock_properties, BasicTestingSetup)

RC_BOOST_PROP(merkleblock_serialization_symmetry, (CMerkleBlock merkleBlock)) { 
  CDataStream ss(SER_NETWORK, PROTOCOL_VERSION);
  ss << merkleBlock;
  CMerkleBlock merkleBlock2; 
  ss >> merkleBlock2; 
  CDataStream ss1(SER_NETWORK, PROTOCOL_VERSION);
  ss << merkleBlock; 
  ss1 << merkleBlock2; 
  RC_ASSERT(ss.str() == ss1.str());
} 

BOOST_AUTO_TEST_SUITE_END()
