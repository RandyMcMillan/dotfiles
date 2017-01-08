#include <rapidcheck/gen/Arbitrary.h>
#include <rapidcheck/Gen.h>
#include "primitives/transaction.h" 
#include "test/gen/script_gen.h"
#include "script/script.h"
#include "amount.h"
namespace rc {
 
  template<>
  struct Arbitrary<COutPoint> {
    static Gen<COutPoint> arbitrary() { 
      return gen::map(gen::tuple(gen::arbitrary<uint256>(), gen::arbitrary<uint32_t>()), [](std::tuple<uint256, uint32_t> outPointPrimitives) {
          uint32_t nIn; 
          uint256 nHashIn; 
          std::tie(nHashIn, nIn) = outPointPrimitives;
          return COutPoint(nHashIn, nIn);
          });
    };
  };


  template<> 
  struct Arbitrary<CTxIn> { 
    static Gen<CTxIn> arbitrary() { 
      return gen::map(gen::tuple(gen::arbitrary<COutPoint>(), gen::arbitrary<CScript>(), gen::arbitrary<uint32_t>()), [](std::tuple<COutPoint, CScript, uint32_t> txInPrimitives) { 
        COutPoint outpoint; 
        CScript script;
        uint32_t sequence; 
        std::tie(outpoint,script,sequence) = txInPrimitives; 
        return CTxIn(outpoint,script,sequence); 
      });
    };
  };
  
  template<>
  struct Arbitrary<CAmount> {
    static Gen<CAmount> arbitrary() {
      //why doesn't this generator call work? It seems to cause an infinite loop. 
      //return gen::arbitrary<int64_t>();
      return gen::inRange<int64_t>(std::numeric_limits<int64_t>::min(),std::numeric_limits<int64_t>::max());
    };
  };

  template<>
  struct Arbitrary<CTxOut> { 
    static Gen<CTxOut> arbitrary() { 
      return gen::map(gen::tuple(gen::arbitrary<CAmount>(), gen::arbitrary<CScript>()), [](std::tuple<CAmount, CScript> txOutPrimitives) {
        CAmount amount;  
        CScript script;
        std::tie(amount,script) = txOutPrimitives;
        return CTxOut(amount,script);
      });
    };
  };


  template<> 
  struct Arbitrary<CTransaction> { 
    static Gen<CTransaction> arbitrary() { 
      return gen::map(gen::tuple(gen::arbitrary<int32_t>(), 
            gen::nonEmpty<std::vector<CTxIn>>(), gen::nonEmpty<std::vector<CTxOut>>(), gen::arbitrary<uint32_t>()), 
          [](std::tuple<int32_t, std::vector<CTxIn>, std::vector<CTxOut>, uint32_t> txPrimitives) { 
        CMutableTransaction tx;
        int32_t nVersion;
        std::vector<CTxIn> vin;
        std::vector<CTxOut> vout;
        uint32_t locktime;
        std::tie(nVersion, vin, vout, locktime) = txPrimitives;
        tx.nVersion=nVersion;
        tx.vin=vin;
        tx.vout=vout;
        tx.nLockTime=locktime;
        return CTransaction(tx); 
      });
    };
  };
}
