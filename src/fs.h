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

#include <boost/filesystem.hpp>
#include <boost/filesystem/fstream.hpp>

/** Filesystem operations and types */
namespace fs {

using namespace boost::filesystem;

/**
 * Path class wrapper to prepare application code for transition from
 * boost::filesystem::path to std::filesystem::path.
 *
 * The new std::filesystem::path class lacks imbue functionality boost provided
 * to make implicit path/string functionality work safely on windows, so this
 * class hides the unsafe methods, and provides explicit PathToString /
 * PathFromString functions which be needed after the transition from boost to
 * convert to native path strings, and explicit u8string / u8path functions to
 * convert to UTF-8 strings. See
 * https://github.com/bitcoin/bitcoin/pull/20744#issuecomment-916627496 for more
 * information about the boost path transition and windows encoding ambiguities.
 */
class path : public boost::filesystem::path
{
public:
    using boost::filesystem::path::path;
    path(boost::filesystem::path path) : boost::filesystem::path::path(std::move(path)) {}
    path(const std::string& string) = delete;
    path& operator=(std::string&) = delete;
    std::string string() const = delete;
    std::string u8string() const { return boost::filesystem::path::string(); }
};

static inline path operator+(path p1, path p2)
{
    p1 += std::move(p2);
    return p1;
}

static inline std::string PathToString(const boost::filesystem::path& path)
{
    return path.string();
}

static inline path PathFromString(const std::string& string)
{
    return boost::filesystem::path(string);
}

static inline path u8path(const std::string& string)
{
    return boost::filesystem::path(string);
}
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

    // GNU libstdc++ specific workaround for opening UTF-8 paths on Windows.
    //
    // On Windows, it is only possible to reliably access multibyte file paths through
    // `wchar_t` APIs, not `char` APIs. But because the C++ standard doesn't
    // require ifstream/ofstream `wchar_t` constructors, and the GNU library doesn't
    // provide them (in contrast to the Microsoft C++ library, see
    // https://stackoverflow.com/questions/821873/how-to-open-an-stdfstream-ofstream-or-ifstream-with-a-unicode-filename/822032#822032),
    // Boost is forced to fall back to `char` constructors which may not work properly.
    //
    // Work around this issue by creating stream objects with `_wfopen` in
    // combination with `__gnu_cxx::stdio_filebuf`. This workaround can be removed
    // with an upgrade to C++17, where streams can be constructed directly from
    // `std::filesystem::path` objects.

#if defined WIN32 && defined __GLIBCXX__
    class ifstream : public std::istream
    {
    public:
        ifstream() = default;
        explicit ifstream(const fs::path& p, std::ios_base::openmode mode = std::ios_base::in) { open(p, mode); }
        ~ifstream() { close(); }
        void open(const fs::path& p, std::ios_base::openmode mode = std::ios_base::in);
        bool is_open() { return m_filebuf.is_open(); }
        void close();

    private:
        __gnu_cxx::stdio_filebuf<char> m_filebuf;
        FILE* m_file = nullptr;
    };
    class ofstream : public std::ostream
    {
    public:
        ofstream() = default;
        explicit ofstream(const fs::path& p, std::ios_base::openmode mode = std::ios_base::out) { open(p, mode); }
        ~ofstream() { close(); }
        void open(const fs::path& p, std::ios_base::openmode mode = std::ios_base::out);
        bool is_open() { return m_filebuf.is_open(); }
        void close();

    private:
        __gnu_cxx::stdio_filebuf<char> m_filebuf;
        FILE* m_file = nullptr;
    };
#else  // !(WIN32 && __GLIBCXX__)
    typedef fs::ifstream ifstream;
    typedef fs::ofstream ofstream;
#endif // WIN32 && __GLIBCXX__
};

#endif // BITCOIN_FS_H
