Configuration changes
---------------------

Error checking is stricter for wallet `-avoidpartialspends`, `-disablewallet`, `-rescan`, `-salvagewallet`, `-spendzeroconfchange`, `-walletbroadcast`, `-walletrbf`, `-keypool`, `-txconfirmtarget`, `-dblogsize`, `-addresstype`, and `-changetype` settings. Values that were previously ambiguous or ignored or would trigger warnings or error later at runtime will now trigger errors immediately on startup.
