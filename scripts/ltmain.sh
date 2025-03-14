#!/usr/bin/env bash 
if [[ -n "${__INTERNAL_LOGGING__:-}" ]]; then
    alias DEBUG=":; ";
else
    alias DEBUG=":; #";
fi;
function System::SourceHTTP () 
{ 
    local URL="$1";
    local -i RETRIES=3;
    shift;
    if hash curl 2> /dev/null; then
        builtin source <(curl --fail -sL --retry $RETRIES "${URL}" || { [[ "$URL" != *'.sh' && "$URL" != *'.bash' ]] && curl --fail -sL --retry $RETRIES "${URL}.sh"; } || echo "e='Cannot import $URL' throw") "$@";
    else
        builtin source <(wget -t $RETRIES -O - -o /dev/null "${URL}" || { [[ "$URL" != *'.sh' && "$URL" != *'.bash' ]] && wget -t $RETRIES -O - -o /dev/null "${URL}.sh"; } || echo "e='Cannot import $URL' throw") "$@";
    fi;
    __oo__importedFiles+=("$URL")
};
function System::SourcePath () 
{ 
    local libPath="$1";
    shift;
    if [[ -d "$libPath" ]]; then
        local file;
        for file in "$libPath"/*.sh;
        do
            System::SourceFile "$file" "$@";
        done;
    else
        System::SourceFile "$libPath" "$@" || System::SourceFile "${libPath}.sh" "$@";
    fi
};
declare -g __oo__fdPath=$(dirname <(echo));
declare -gi __oo__fdLength=$(( ${#__oo__fdPath} + 1 ));
function System::ImportOne () 
{ 
    local libPath="$1";
    local __oo__importParent="${__oo__importParent-}";
    local requestedPath="$libPath";
    shift;
    if [[ "$requestedPath" == 'github:'* ]]; then
        requestedPath="https://raw.githubusercontent.com/${requestedPath:7}";
    else
        if [[ "$requestedPath" == './'* ]]; then
            requestedPath="${requestedPath:2}";
        else
            if [[ "$requestedPath" == "$__oo__fdPath"* ]]; then
                requestedPath="${requestedPath:$__oo__fdLength}";
            fi;
        fi;
    fi;
    if [[ "$requestedPath" != 'http://'* && "$requestedPath" != 'https://'* ]]; then
        requestedPath="${__oo__importParent}/${requestedPath}";
    fi;
    if [[ "$requestedPath" == 'http://'* || "$requestedPath" == 'https://'* ]]; then
        __oo__importParent=$(dirname "$requestedPath") System::SourceHTTP "$requestedPath";
        return;
    fi;
    { 
        local localPath="$( cd "${BASH_SOURCE[1]%/*}" && pwd )";
        localPath="${localPath}/${libPath}";
        System::SourcePath "${localPath}" "$@"
    } || System::SourcePath "${requestedPath}" "$@" || System::SourcePath "${libPath}" "$@" || System::SourcePath "${__oo__libPath}/${libPath}" "$@" || System::SourcePath "${__oo__path}/${libPath}" "$@" || e="Cannot import $libPath" throw
};
function System::Import () 
{ 
    local libPath;
    for libPath in "$@";
    do
        System::ImportOne "$libPath";
    done
};
function File::GetAbsolutePath () 
{ 
    local file="$1";
    if [[ "$file" == "/"* ]]; then
        echo "$file";
    else
        echo "$(cd "$(dirname "$file")" && pwd)/$(basename "$file")";
    fi
};
function System::WrapSource () 
{ 
    local libPath="$1";
    shift;
    builtin source "$libPath" "$@" || throw "Unable to load $libPath"
};
function System::SourceFile () 
{ 
    local libPath="$1";
    shift;
    [[ ! -f "$libPath" ]] && return 1;
    libPath="$(File::GetAbsolutePath "$libPath")";
    if [[ -f "$libPath" ]]; then
        if [[ "${__oo__allowFileReloading-}" != true ]] && [[ ! -z "${__oo__importedFiles[*]}" ]] && Array::Contains "$libPath" "${__oo__importedFiles[@]}"; then
            return 0;
        fi;
        __oo__importedFiles+=("$libPath");
        __oo__importParent=$(dirname "$libPath") System::WrapSource "$libPath" "$@";
    else
        :;
    fi
};
function System::Bootstrap () 
{ 
    if ! System::Import Array/Contains; then
        cat <<< "FATAL ERROR: Unable to bootstrap (missing lib directory?)" 1>&2;
        exit 1;
    fi
};
export PS4='+(${BASH_SOURCE##*/}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }';
set -o pipefail;
shopt -s expand_aliases;
declare -g __oo__libPath="$( cd "${BASH_SOURCE[0]%/*}" && pwd )";
declare -g __oo__path="${__oo__libPath}/..";
declare -ag __oo__importedFiles;
function namespace () 
{ 
    :
};
function throw () 
{ 
    eval 'cat <<< "Exception: $e ($*)" 1>&2; read -s;'
};
System::Bootstrap;
alias import="__oo__allowFileReloading=false System::Import";
alias source="__oo__allowFileReloading=true System::ImportOne";
alias .="__oo__allowFileReloading=true System::ImportOne";
declare -g __oo__bootstrapped=true

