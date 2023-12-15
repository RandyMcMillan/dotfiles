#!/usr/bin/env bash
#
declare -i ARG1
declare -i ARG2
declare -i ARG3
declare -i ARG4
declare -i ARG5
declare -i ARG6
declare -i ARG7
declare -i ARG8

ARG1=${BASHPID:$1}
ARG2=${BASHPID:$2}
ARG3=${BASHPID:$3}
ARG4=${BASHPID:$4}
ARG5=${BASHPID:$5}
ARG6=${BASHPID:$6}
ARG7=${BASHPID:$7}
ARG8=${BASHPID:$8}
ARG9=${BASHPID:$9}

function boo(){

    echo ARG1=$ARG1
    echo ARG2=$ARG2
    echo ARG3=$ARG3
    echo ARG4=$ARG4
    echo ARG5=$ARG5
    echo ARG6=$ARG6
    echo ARG7=$ARG7
    echo ARG8=$ARG8
    echo ARG9=$ARG9
    echo ARG11=$ARG1
    echo ARG12=$ARG2
    echo ARG13=$ARG3
    echo ARG14=$ARG4
    echo ARG15=$ARG5
    echo ARG16=$ARG6
    echo ARG17=$ARG7
    echo ARG18=$ARG8
    echo ARG19=$ARG9
    echo ARG11=$ARG11
    echo ARG12=$ARG21
    echo ARG13=$ARG31
    echo ARG14=$ARG41
    echo ARG15=$ARG51
    echo ARG16=$ARG61
    echo ARG17=$ARG71
    echo ARG18=$ARG81
    echo ARG19=$ARG91

}
[[ ! -z '$BASHPID' ]] && BASH4=1
function main4(){
boo
ARG11=${BASHPID:$1}
ARG21=${BASHPID:$2}
ARG31=${BASHPID:$3}
ARG41=${BASHPID:$4}
ARG51=${BASHPID:$5}
ARG61=${BASHPID:$6}
ARG71=${BASHPID:$7}
ARG81=${BASHPID:$8}
ARG91=${BASHPID:$9}
boo
}
function main(){
boo
}
[[   -z '$BASH4' ]] && main;
[[ ! -z '$BASH4' ]] && main4;
