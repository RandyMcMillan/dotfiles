// Copyright (c) 2012-2016 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.
#include "test/gen/bloom_gen.h"
#include "test/gen/crypto_gen.h"

#include "test/test_bitcoin.h"

#include <boost/test/unit_test.hpp>
#include <rapidcheck/boost_test.h>
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>


BOOST_FIXTURE_TEST_SUITE(bloom_properties, BasicTestingSetup)

RC_BOOST_PROP(no_false_negatives, (CBloomFilter bloomFilter, uint256 hash)) {
  bloomFilter.insert(hash);
  bool result = bloomFilter.contains(hash);
  RC_ASSERT(result);
}

RC_BOOST_PROP(serialization_symmetry, (CBloomFilter bloomFilter)) {
  CDataStream ss(SER_NETWORK, PROTOCOL_VERSION);
  ss << bloomFilter;
  CBloomFilter bloomFilter2; 
  ss >> bloomFilter2; 
  CDataStream ss1(SER_NETWORK, PROTOCOL_VERSION);
  ss << bloomFilter;  
  ss1 << bloomFilter2;
  RC_ASSERT(ss.str() == ss1.str());
}
BOOST_AUTO_TEST_SUITE_END()
