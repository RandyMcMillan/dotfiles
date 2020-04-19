#!/usr/bin/env bash
source "$( cd "${BASH_SOURCE[0]%/*}" && pwd )/infinity/lib/oo-bootstrap.sh"

import util/exception util/tryCatch util/log util/test

describe 'Try Catch'
  it 'should throw a "test exception"'
  try
    try {
      e="test exception" throw
    } catch {
      [[ "${__EXCEPTION__[1]}" == "test exception" ]]
    }
  expectPass

  it 'should throw a general exception inside of a catch'
  try {
    try {
      false
    } catch {
      e="we throw again inside of a catch" throw
      echo this should not be displayed
    }
    echo this should not be displayed
  }
  expectFail

summary


import util/exception util/log util/type util/test
Log::AddOutput util/type CUSTOM

describe 'Operations on primitives'
  it 'should make a number and change its value using the setter'
  try
    integer aNumber=10
    $var:aNumber = 12
    [[ $aNumber -eq 12 ]]
  expectPass

  it "should make basic operations on two arrays"
  try
    array Letters
    array Letters2

    $var:Letters push "Hello Bobby"
    $var:Letters push "Hello Maria"

    $var:Letters contains "Hello Bobby"
    $var:Letters contains "Hello Maria"

    $var:Letters2 push "Hello Midori,
                        Best regards!"

    $var:Letters2 concatPush $var:Letters
    $var:Letters2 contains "Hello Bobby"
  expectPass
summary

import util/log util/type
Log::AddOutput util/type CUSTOM

regex() {
  # create a string someString
  string someString="My 123 Joe is 99 Mark"

  # saves all matches and their match groups for the said regex:
  array matchGroups=$($var:someString getMatchGroups '([0-9]+) [a-zA-Z]+')

  # lists all matches in group 1:
  $var:matchGroups every 2 1

  ## group 0, match 1
  $var:someString match '([0-9]+) [a-zA-Z]+' 0 1

  # calls the getter - here it prints the value
  $var:someString
}

regex


import util/namedParameters util/class

class:Human() {
  public string name
  public integer height
  public array eaten

  Human.__getter__() {
    echo "I'm a human called $(this name), $(this height) cm tall."
  }

  Human.Example() {
    [array]     someArray
    [integer]   someNumber
    [...rest]   arrayOfOtherParams

    echo "Testing $(var: someArray toString) and $someNumber"
    echo "Stuff: ${arrayOfOtherParams[*]}"

    # returning the first passed in array
    @return someArray
  }

  Human.Eat() {
    [string] food

    this eaten push "$food"

    # will return a string with the value:
    @return:value "$(this name) just ate $food, which is the same as $1"
  }

  Human.WhatDidHeEat() {
    this eaten toString
  }

  # this is a static method, hence the :: in definition
  Human::PlaySomeJazz() {
    echo "$(UI.Powerline.Saxophone)"
  }
}

# required to initialize the class
Type::Initialize Human

# create an object called 'Mark' of type Human
Human Mark

# call the string.= (setter) method
$var:Mark name = 'Mark'

# call the integer.= (setter) method
$var:Mark height = 180

# adds 'corn' to the Mark.eaten array and echoes the output
$var:Mark Eat 'corn'

# adds 'blueberries' to the Mark.eaten array and echoes the uppercased output
$var:Mark : { Eat 'blueberries' } { toUpper }

# invoke the getter
$var:Mark


## singleton

class:SingletonExample() {
  private integer YoMamaNumber = 150

  SingletonExample.PrintYoMama() {
    echo "Number is: $(this YoMamaNumber)!"
  }
}

# required to initialize the static class
Type::InitializeStatic SingletonExample

# invoke the method on the static instance of SingletonExample
SingletonExample PrintYoMama

import util/exception util/tryCatch util/log util/test

exit 1

import util/log util/type
Log::AddOutput util/type CUSTOM

manipulatingArrays() {
  array exampleArrayA
  array exampleArrayB

  $var:exampleArrayA push 'one'
  $var:exampleArrayA push 'two'

  # above is equivalent to calling:
  #   var: exampleArrayA push 'two'
  # or using native bash
  #   exampleArrayA+=( 'two' )

  $var:exampleArrayA toString
  $var:exampleArrayA toJSON
}

passingArrays() {

  passingArraysInput() {
    [array] passedInArray

    $var:passedInArray : \
      { map 'echo "${index} - $(var: item)"' } \
      { forEach 'var: item toUpper' }

    $var:passedInArray push 'will work only for references'
  }

  array someArray=( 'one' 'two' )

  echo 'passing by $var:'
  ## 2 ways of passing a copy of an array (passing by it's definition)
  passingArraysInput "$(var: someArray)"
  passingArraysInput $var:someArray

  ## no changes yet
  $var:someArray toJSON

  echo
  echo 'passing by $ref:'

  ## in bash >=4.3, which supports references, you may pass by reference
  ## this way any changes done to the variable within the function will affect the variable itself
  passingArraysInput $ref:someArray

  ## should show changes
  $var:someArray toJSON
}

## RUN IT:
manipulatingArrays
passingArrays


