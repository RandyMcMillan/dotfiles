// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or https://www.opensource.org/licenses/mit-license.php.

#include <util/result.h>
#include <util/string.h>

namespace util {
bilingual_str ErrorString(const std::vector<bilingual_str>& errors)
{
    return Join(errors, Untranslated(" "));
}

bilingual_str ErrorString(const std::vector<bilingual_str>& errors, const std::vector<bilingual_str>& warnings)
{
    bilingual_str result = ErrorString(errors);
    if (!warnings.empty()) {
        if (!errors.empty()) result += Untranslated(" ");
        result += ErrorString(warnings);
    }
    return result;
}
} // namespace util

