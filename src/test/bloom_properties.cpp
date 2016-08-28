// Copyright (c) 2012-2016 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.
#include "key.h"

//#include "base58.h"
//#include "script/script.h"
//#include "uint256.h"
//#include "util.h"
//#include "utilstrencodings.h"
#include "test/test_bitcoin.h"
//#include <string>
//#include <vector>

#include <boost/test/unit_test.hpp>
#include <rapidcheck/boost_test.h>
#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>

#include "test/gen/bloom_gen.h"
#include "test/gen/crypto_gen.h"

BOOST_FIXTURE_TEST_SUITE(bloom_properties, BasicTestingSetup)

RC_BOOST_PROP(no_false_negatives, (CBloomFilter bloomFilter, uint256 hash)) {
  bloomFilter.insert(hash);
  RC_ASSERT(bloomFilter.contains(hash));
}

BOOST_AUTO_TEST_SUITE_END()
