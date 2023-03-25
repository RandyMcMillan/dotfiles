Function.Exists(){
    local name="$1"
    local typeMatch=$(type "$name" 2> /dev/null) || return 1
    echo "$typeMatch" | grep "function\|alias" &> /dev/null || return 1
    return 0
}
alias Object.Exists="Function.Exists"

Function.AssignParamLocally() {
    local commandWithArgs=( $1 )
    local command="${commandWithArgs[0]}"

    shift

    if [[ "$command" == "trap" || "$command" == "l="* || "$command" == "_type="* ]]
    then
        return 0
    fi

    if [[ "${commandWithArgs[*]}" == "true" ]]
    then
        __assign_next=true
        # Log.Write "Will assign next one"
        return 0
    fi

    local varDeclaration="${commandWithArgs[1]}"
    if [[ $varDeclaration == '-'* ]]
    then
        varDeclaration="${commandWithArgs[2]}"
    fi
    local varName="${varDeclaration%%=*}"

    # var value is only important if making an object later on from it
    local varValue="${varDeclaration#*=}"

    if [[ ! -z $__assign_varType ]]
    then
        # Log.Write "SETTING $__assign_varName = \$$__assign_paramNo"
        # Log.Write --

        if [[ "$__assign_varType" == "array" ]]
        then
            # passing array:
            execute="$__assign_varName=( \"\${@:$__assign_paramNo:$__assign_arrLength}\" )"
            eval "$execute"
            __assign_paramNo+=$(($__assign_arrLength - 1))

            unset __assign_arrLength
        elif [[ "$__assign_varType" == "params" ]]
        then
            execute="$__assign_varName=( \"\${@:$__assign_paramNo}\" )"
            eval "$execute"
        elif [[ "$__assign_varType" == "reference" ]]
        then
            execute="$__assign_varName=\"\$$__assign_paramNo\""
            eval "$execute"
        elif [[ ! -z "${!__assign_paramNo}" ]]
        then
            execute="$__assign_varName=\"\$$__assign_paramNo\""
            # Log.Write "EXECUTE $execute"
            eval "$execute"
        fi
        unset __assign_varType
    fi

    if [[ "$command" != "local" || "$__assign_next" != "true" ]]
    then
        __assign_normalCodeStarted+=1

        # Log.Write "NOPASS ${commandWithArgs[*]}"
        # Log.Write "normal code count ($__assign_normalCodeStarted)"
        # Log.Write --
    else
        unset __assign_next

        __assign_normalCodeStarted=0
        __assign_varName="$varName"
        __assign_varType="$__capture_type"
        __assign_arrLength="$__capture_arrLength"

        # Log.Write "PASS ${commandWithArgs[*]}"
        # Log.Write --

        __assign_paramNo+=1
    fi
}

Function.CaptureParams() {
    # Log.Write "Capturing Type $_type"
    # Log.Write --

    __capture_type="$_type"
    __capture_arrLength="$l"
}

# NOTE: true; true; at the end is required to workaround an edge case where TRAP doesn't behave properly
alias @trapAssign='Function.CaptureParams; declare -i __assign_normalCodeStarted=0; trap "declare -i __assign_paramNo; Function.AssignParamLocally \"\$BASH_COMMAND\" \"\$@\"; [[ \$__assign_normalCodeStarted -ge 2 ]] && trap - DEBUG && unset __assign_varType && unset __assign_varName && unset __assign_paramNo" DEBUG; true; true; '
alias @param='@trapAssign local'
alias @reference='_type=reference @trapAssign local -n'
alias @var='_type=var @param'
alias @int='_type=int @trapAssign local -i'
alias @params='_type=params @param'
alias @array='_type=array @param'
