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

/**
 * Path class wrapper to blocks calls to the fs::path(std::string) implicit
 * constructor and the fs::path::string() method, which worked well in the
 * boost::filesystem implementation, but have unsafe and unpredictable behavior
 * on Windows in the std::filesystem implementation (see implementation note in
 * \ref PathToString for details)
 */
class path : public std::filesystem::path
{
public:
    using std::filesystem::path::path;

    // Allow path objects arguments for comptability.
    path(std::filesystem::path path) : std::filesystem::path::path(std::move(path)) {}
    path& operator=(std::filesystem::path path) { std::filesystem::path::operator=(std::move(path)); return *this; }
    path& operator/=(std::filesystem::path path) { std::filesystem::path::operator/=(std::move(path)); return *this; }

    // Allow literal string arguments, which are safe as long as the literals are ASCII.
    path(const char* c) : std::filesystem::path(c) {}
    path& operator=(const char* c) { std::filesystem::path::operator=(c); return *this; }
    path& operator/=(const char* c) { std::filesystem::path::operator/=(c); return *this; }
    path& append(const char* c) { std::filesystem::path::append(c); return *this; }

    // Disallow std::string arguments to avoid locale-dependent decoding on windows.
    path(std::string) = delete;
    path& operator=(std::string) = delete;
    path& operator/=(std::string) = delete;
    path& append(std::string) = delete;

    // Disallow std::string conversion method to avoid locale-dependent encoding on windows.
    std::string string() const = delete;
};

// Allow safe path append operations.
static inline path operator+(path p1, path p2)
{
    p1 += std::move(p2);
    return p1;
}

/**
 * Convert path object to byte string. On POSIX, paths natively are byte
 * strings so this is trivial. On Windows, paths natively are Unicode, so an
 * encoding step is necessary.
 *
 * The inverse of \ref PathToString is \ref PathFromString. The strings
 * returned and parsed by these functions can be used to call POSIX APIs, and
 * for roundtrip conversion, logging, and debugging. But they are not
 * guaranteed to be valid UTF-8, and are generally meant to be used internally,
 * not externally. When communicating with external programs and libraries that
 * require UTF-8, fs::path::u8string() and fs::u8path() methods can be used.
 * For other applications, if support for non UTF-8 paths is required, or if
 * higher-level JSON or XML or URI or C-style escapes are preferred, it may be
 * also be appropriate to use different path encoding functions.
 *
 * Implementation note: On Windows, the std::filesystem::path(string)
 * constructor and std::filesystem::path::string() method are not safe to use
 * here, because these methods encode the path using C++'s narrow multibyte
 * encoding, which on Windows corresponds to the current "code page", which is
 * unpredictable and typically not able to represent all valid paths. So
 * std::filesystem::path::u8string() and std::filesystem::u8path() functions
 * are used instead on Windows. On POSIX, u8string/u8path functions are not
 * safe to use because paths are not always valid UTF-8, so plain string
 * methods which do not transform the path there are used.
 */
static inline std::string PathToString(const path& path)
{
#ifdef WIN32
    return path.u8string();
#else
    static_assert(std::is_same<path::string_type, std::string>::value, "PathToString not implemented on this platform");
    return path.std::filesystem::path::string();
#endif
}

/**
 * Convert byte string to path object. Inverse of \ref PathToString.
 */
static inline path PathFromString(const std::string& string)
{
#ifdef WIN32
    return u8path(string);
#else
    return std::filesystem::path(string);
#endif
}
} // namespace fs

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
