
#include "test/gen/transaction_gen.h"

#include "key.h"
#include "base58.h"
#include "script/script.h"
#include "policy/policy.h"
#include "primitives/transaction.h"
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

BOOST_FIXTURE_TEST_SUITE(transaction_properties, BasicTestingSetup)
/** Helper function to run a SpendingInfo through the interpreter to check
  * validity of the transaction spending a spk */
bool run(SpendingInfo info) {
  const CTxOut output = std::get<0>(info);
  const CTransaction tx = std::get<1>(info);
  const int inputIndex = std::get<2>(info);
  const CTxIn input = tx.vin[inputIndex];
  const CScript scriptSig = input.scriptSig;
  TransactionSignatureChecker checker(&tx,inputIndex,output.nValue);
  const CScriptWitness wit = input.scriptWitness;
  //run it through the interpreter
  bool result = VerifyScript(scriptSig,output.scriptPubKey,
    &wit, STANDARD_SCRIPT_VERIFY_FLAGS, checker);
  return result;
}
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

/** Check that we can spend a p2pk tx that ProduceSignature created */
RC_BOOST_PROP(spend_p2pk_tx, ()) {
  SpendingInfo info = *signedP2PKTx();
  RC_ASSERT(run(info));
}

/** Check that we can spend a p2pkh tx that ProduceSignature created */
RC_BOOST_PROP(spend_p2pkh_tx, ()) {
  SpendingInfo info = *signedP2PKHTx();
  RC_ASSERT(run(info));
}

/** Check that we can spend a multisig tx that ProduceSignature created */
RC_BOOST_PROP(spend_multisig_tx, ()) {
  SpendingInfo info = *signedMultisigTx();
  RC_ASSERT(run(info));
}
/** Check that we can spend a p2sh tx that ProduceSignature created */
RC_BOOST_PROP(spend_p2sh_tx, ()) {
  SpendingInfo info = *signedP2SHTx();
  const auto output = std::get<0>(info);
  const auto tx = std::get<1>(info);
  bool result = run(info);
  RC_ASSERT(result);
}

RC_BOOST_PROP(spend_p2wpkh_tx, ()) {
  SpendingInfo info = *signedP2WPKHTx();
  RC_ASSERT(run(info));
}

RC_BOOST_PROP(spend_p2wsh_tx, ()) {
  SpendingInfo info = *signedP2WSHTx();
  RC_ASSERT(run(info));
}

BOOST_AUTO_TEST_SUITE_END()
