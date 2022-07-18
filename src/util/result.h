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
#include <utility>
#include <vector>

namespace util {
namespace detail {
//! Subsitute for std::monostate that doesn't depend on std::variant.
struct MonoState{};

//! Error information only allocated on failure.
template <typename F>
struct ErrorInfo {
    std::conditional_t<std::is_same_v<F, void>, MonoState, F> failure;
    bilingual_str error;
};

//! Result base class which is inherited by Result<T, F>.
//! T is the type of the success return value, or void if there is none.
//! F is the type of the failure return value, or void if there is none.
template <typename T, typename F>
class ResultBase;

//! Result base specialization for empty (T=void) value type. Holds error
//! information and provides accessor methods.
template <typename F>
class ResultBase<void, F>
{
protected:
    std::unique_ptr<ErrorInfo<F>> m_info;

    //! Value setter methods that do nothing because this class has value type T=void.
    void ConstructValue() {}
    template <typename O>
    void MoveValue(O& other) {}
    void DestroyValue() {}

public:
    //! Success check.
    explicit operator bool() const { return !m_info; }

    //! Error retrieval.
    const auto& GetFailure() const LIFETIMEBOUND { assert(!*this); return m_info->failure; }
};

//! Result base class for T value type. Holds value and provides accessor methods.
template <typename T, typename F>
class ResultBase : public ResultBase<void, F>
{
protected:
    //! Result success value. Uses anonymous union so success value is never
    //! constructed in failure case.
    union { T m_value; };

    template <typename... Args>
    void ConstructValue(Args&&... args) { new (&m_value) T{std::forward<Args>(args)...}; }
    template <typename O>
    void MoveValue(O& other) { new (&m_value) T{std::move(other.m_value)}; }
    void DestroyValue() { m_value.~T(); }

    //! Empty constructor that needs to be declared because the class contains a union.
    ResultBase() {}
    ~ResultBase() { if (*this) DestroyValue(); }

    template <typename, typename>
    friend class ResultBase;

public:
    //! std::optional methods, so functions returning optional<T> can change to
    //! return Result<T> with minimal changes to existing code, and vice versa.
    bool has_value() const { return bool{*this}; }
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

//! Wrapper types to pass error strings to Result constructors.
struct Error {
    bilingual_str message;
};

//! The util::Result class provides a standard way for functions to return error
//! strings in addition to optional result values.
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
//!
//! Most code does not need different error-handling behavior for different
//! types of errors, and can suffice just using the type `T` success value on
//! success, and descriptive error strings when there's a failure. But
//! applications that do need more complicated error-handling behavior can
//! override the default `F = void` failure type and get failure values by
//! calling result.GetFailure().
template <typename T, typename F = void>
class Result : public detail::ResultBase<T, F>
{
protected:
    template <typename... Args>
    void Construct(Args&&... args)
    {
        this->ConstructValue(std::forward<Args>(args)...);
    }

    template <typename... Args>
    void Construct(Error error, Args&&... args)
    {
        this->m_info.reset(new detail::ErrorInfo<F>{.failure{std::forward<Args>(args)...}, .error{std::move(error.message)}});
    }

    template<typename OT, typename OF>
    void MoveConstruct(Result<OT, OF>& other)
    {
        if (other) this->MoveValue(other); else this->m_info.reset(new detail::ErrorInfo<F>{std::move(*other.m_info)});
    }

    template <typename, typename>
    friend class Result;

public:
    template <typename... Args>
    Result(Args&&... args)
    {
        Construct(std::forward<Args>(args)...);
    }

    template<typename OT, typename OF>
    Result(Result<OT, OF>&& other) { MoveConstruct(other); }

    Result& Set(Result&& other) LIFETIMEBOUND
    {
        if (*this) this->DestroyValue(); else this->m_info.reset();
        MoveConstruct(other);
        return *this;
    }

    inline friend bilingual_str _ErrorString(const Result& result)
    {
        return result ? bilingual_str{} : result.m_info->error;
    }
};

template<typename T, typename F>
bilingual_str ErrorString(const Result<T, F>& result) { return _ErrorString(result); }
} // namespace util

#endif // BITCOIN_UTIL_RESULT_H
