// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or https://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_UTIL_RESULT_H
#define BITCOIN_UTIL_RESULT_H

#include <attributes.h>
#include <util/translation.h>

#include <memory>
#include <optional>
#include <tuple>
#include <variant>
#include <vector>

namespace util {
namespace detail {
//! Empty string list
const std::vector<bilingual_str> EMPTY_LIST{};

//! Helper to move elements from one container to another.
template <typename T>
void MoveElements(T& src, T& dest)
{
    dest.insert(dest.end(), std::make_move_iterator(src.begin()), std::make_move_iterator(src.end()));
    src.clear();
}

//! Error information only allocated if there are errors or warnings.
template <typename F>
struct ErrorInfo {
    std::optional<std::conditional_t<std::is_same<F, void>::value, std::monostate, F>> failure;
    std::vector<bilingual_str> errors;
    std::vector<bilingual_str> warnings;
};

//! Result base class which is inherited by Result<T, F>.
template <typename T, typename F>
class ResultBase;

//! Result base specialization for empty (T=void) value type. Holds error
//! information and provides accessor methods.
template <typename F>
class ResultBase<void, F>
{
protected:
    std::unique_ptr<ErrorInfo<F>> m_info;

    template <typename... Args>
    void InitFailure(Args&&... args)
    {
        if (!m_info) m_info = std::make_unique<ErrorInfo<F>>();
        m_info->failure.emplace(std::forward<Args>(args)...);
    }
    void InitValue() {}
    template <typename O>
    void MoveValue(O& other) {}
    void DestroyValue() {}

public:
    void AddError(bilingual_str error)
    {
        if (error.empty()) return;
        if (!m_info) m_info = std::make_unique<ErrorInfo<F>>();
        m_info->errors.emplace_back(std::move(error));
    }

    void AddWarning(bilingual_str warning)
    {
        if (warning.empty()) return;
        if (!m_info) m_info = std::make_unique<ErrorInfo<F>>();
        m_info->warnings.emplace_back(std::move(warning));
    }

    //! Success check.
    operator bool() const { return !m_info || !m_info->failure; }

    //! Error retrieval.
    template <typename _F = F>
    std::enable_if_t<!std::is_same<_F, void>::value, const _F&> GetFailure() const { assert(!*this); return *m_info->failure; }
    const std::vector<bilingual_str>& GetErrors() const { return m_info ? m_info->errors : EMPTY_LIST; }
    const std::vector<bilingual_str>& GetWarnings() const { return m_info ? m_info->warnings : EMPTY_LIST; }
};

//! Result base class for T value type. Holds value and provides accessor methods.
template <typename T, typename F>
class ResultBase : public ResultBase<void, F>
{
protected:
    union { T m_value; };

    ResultBase() {}
    ~ResultBase() {}

    template <typename... Args>
    void InitValue(Args&&... args) { new (&m_value) T{std::forward<Args>(args)...}; }
    template <typename O>
    void MoveValue(O& other) { new (&m_value) T{std::move(other.m_value)}; }
    void DestroyValue() { m_value.~T(); }

    template <typename FT, typename FF>
    friend class ResultBase;

public:
    //! std::optional methods, so functions returning optional<T> can change to
    //! return Result<T> with minimal changes to existing code, and vice versa.
    bool has_value() const { return *this; }
    const T& value() const LIFETIMEBOUND { assert(*this); return m_value; }
    T& value() LIFETIMEBOUND { assert(*this); return m_value; }
    template <class U>
    T value_or(U&& default_value) const&
    {
        return has_value() ? value() : std::forward<U>(default_value);
    }
    template <class U>
    T value_or(U&& default_value) &&
    {
        return has_value() ? std::move(value()) : std::forward<U>(default_value);
    }
    const T* operator->() const LIFETIMEBOUND { return &value(); }
    const T& operator*() const LIFETIMEBOUND { return value(); }
    T* operator->() LIFETIMEBOUND { return &value(); }
    T& operator*() LIFETIMEBOUND { return value(); }
};
} // namespace detail

//! Wrapper types to pass error and warning strings to Result constructors.
struct Error {
    bilingual_str message;
};
struct Warning {
    bilingual_str message;
};

//! The util::Result class provides a standard way for functions to return error
//! and warning strings in addition to optional result values.
//!
//! It is intended for high-level functions that need to report error strings to
//! end users. Lower-level functions that don't need this error-reporting and
//! only need error-handling should avoid util::Result and instead use standard
//! classes like std::optional, std::variant, and std::tuple, or custom structs
//! and enum types to return function results.
//!
//! Usage examples can be found in \example ../test/result_tests.cpp, but in
//! general code returning `util::Result<T>` values is very similar to code
//! returning `std::optional<T>` values. Existing functions returning
//! `std::optional<T>` can be updated to return `util::Result<T>` and return
//! error strings usually just replacing `return std::nullopt;` with `return
//! util::Error{error_string};`.
template <typename T, typename F = void>
class Result : public detail::ResultBase<T, F>
{
protected:
    template <typename Fn, typename... Args>
    void Construct(const Fn& fn, Args&&... args)
    {
        fn(std::forward<Args>(args)...);
    }

    template <typename Fn, typename... Args>
    void Construct(const Fn& fn, Error error, Args&&... args)
    {
        this->AddError(std::move(error.message));
        Construct([this](auto&&... x) { this->InitFailure(std::forward<decltype(x)>(x)...); }, std::forward<Args>(args)...);
    }

    template <typename Fn, typename... Args>
    void Construct(const Fn& fn, Warning warning, Args&&... args)
    {
        this->AddWarning(std::move(warning.message));
        Construct(fn, std::forward<Args>(args)...);
    }

    template <typename Fn, typename OT, typename OF, typename... Args>
    void Construct(const Fn& fn, Result<OT, OF>&& other, Args&&... args)
    {
        *this << std::move(other);
        Construct(fn, std::forward<Args>(args)...);
    }

    template <typename OT, typename OF>
    void MoveConstruct(Result<OT, OF>& other)
    {
        *this << std::move(other);
        if (other) this->MoveValue(other); else if (other.m_info) this->m_info->failure = std::move(other.m_info->failure);
    }

    template <typename FT, typename FF>
    friend class Result;

public:
    //! Constructors, destructor, and assignment operator.
    template <typename... Args>
    Result(Args&&... args)
    {
        Construct([this](auto&&... x) { this->InitValue(std::forward<decltype(x)>(x)...); }, std::forward<Args>(args)...);
    }
    template <typename OT, typename OF>
    Result(Result<OT, OF>&& other) { MoveConstruct(other); }
    Result& operator=(Result&& other)
    {
        if (*this) this->DestroyValue(); else this->m_info->failure.reset();
        MoveConstruct(other);
        return *this;
    }
    ~Result() { if (*this) this->DestroyValue(); }

    //! Operator moving warning and error messages from one result to another.
    template <typename OT, typename OF>
    Result<OT, OF>&& operator<<(Result<OT, OF>&& other)
    {
        if (other.m_info && !this->m_info) {
            this->m_info.reset(new detail::ErrorInfo<F>{.errors = std::move(other.m_info->errors),
                                                        .warnings = std::move(other.m_info->warnings)});
        } else if (other.m_info && this->m_info) {
            detail::MoveElements(other.m_info->errors, this->m_info->errors);
            detail::MoveElements(other.m_info->warnings, this->m_info->warnings);
        }
        return std::move(other);
    }
};

//! Helper methods to format error strings.
bilingual_str ErrorString(const std::vector<bilingual_str>& errors);
bilingual_str ErrorString(const std::vector<bilingual_str>& errors, const std::vector<bilingual_str>& warnings);
template <typename T, typename F>
bilingual_str ErrorString(const Result<T, F>& result) { return ErrorString(result.GetErrors(), result.GetWarnings()); }
} // namespace util

#endif // BITCOIN_UTIL_RESULT_H
