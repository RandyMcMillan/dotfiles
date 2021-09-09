// Copyright (c) 2017-2019 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_FS_H
#define BITCOIN_FS_H

#include <stdio.h>
#include <string>
#if defined WIN32 && defined __GLIBCXX__
#include <ext/stdio_filebuf.h>
#endif

#include <filesystem>
#include <fstream>

/** Filesystem operations and types */
namespace fs {

using namespace std::filesystem;

inline std::filesystem::path StringToPath(const std::string& string)
{
    // Background: Unix filesystem APIs accept 8-bit strings without assuming
    // any particular text encoding. By contrast, Windows filesystem APIs
    // require paths to be valid text (typically represented interally as
    // UTF-16).
    //
    // On unix, when we construct filesystem::path objects from std::string
    // command line arguments, environment variables, config files, etc, we
    // generally do not want to make any assumptions about the string, or
    // attempt to decode and re-encode it. Instead we want to pass it directly
    // to the path(std::string) constructor, avoiding any conversions.
    //
    // On windows, we usually want to avoid the path(std::string) constructor,
    // because that constructor assumes the string is the "native narrow"
    // encoding which varies at runtime depending on the code page. Most bitcoin
    // application code is written to be code-page agnostic and just use UTF-8
    // instead of other encodings, so the best thing to do by default on windows
    // is call the filesystem::u8path function to construct the path.
#ifndef WIN32
    return path(string);
#else
    return u8path(string);
#endif
}

/**
 * Custom filesystem::path class that tries to avoid text encoding bugs on
 * windows, while still be easy to use.
 *
 * On unix, encoding behavior of this class is identical to the normal
 * filesystem::path class. On windows, problematic std::string constructor which
 * assumes "native narrow" encoding based on the current code page is replaced
 * with a constructor that assumes UTF-8 encoding, which is the encoding used by
 * more bitcoin code.
 */
class path : public std::filesystem::path
{
public:
    path() = default;
    path(const std::filesystem::path& path) : std::filesystem::path(path) {}
    path(const std::string& string) : std::filesystem::path(StringToPath(string)) {}
    path(const char* string) : std::filesystem::path(StringToPath(string)) {}
};
}

/** Bridge operations to C stdio */
namespace fsbridge {
    FILE *fopen(const fs::path& p, const char *mode);

    /**
     * Helper function for joining two paths
     *
     * @param[in] base  Base path
     * @param[in] path  Path to combine with base
     * @returns path unchanged if it is an absolute path, otherwise returns base joined with path. Returns base unchanged if path is empty.
     * @pre  Base path must be absolute
     * @post Returned path will always be absolute
     */
    fs::path AbsPathJoin(const fs::path& base, const fs::path& path);

    class FileLock
    {
    public:
        FileLock() = delete;
        FileLock(const FileLock&) = delete;
        FileLock(FileLock&&) = delete;
        explicit FileLock(const fs::path& file);
        ~FileLock();
        bool TryLock();
        std::string GetReason() { return reason; }

    private:
        std::string reason;
#ifndef WIN32
        int fd = -1;
#else
        void* hFile = (void*)-1; // INVALID_HANDLE_VALUE
#endif
    };

    std::string get_filesystem_error_message(const fs::filesystem_error& e);

    typedef std::ifstream ifstream;
    typedef std::ofstream ofstream;
};

#endif // BITCOIN_FS_H
