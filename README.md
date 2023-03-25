# Mathias’s dotfiles

![Screenshot of my shell prompt](https://i.imgur.com/EkEtphC.png)

## Installation

**Warning:** If you want to give these dotfiles a try, you should first fork this repository, review the code, and remove things you don’t want or need. Don’t blindly use my settings unless you know what that entails. Use at your own risk!

### Using Git and the bootstrap script

You can clone the repository wherever you want. (I like to keep it in `~/Projects/dotfiles`, with `~/dotfiles` as a symlink.) The bootstrapper script will pull in the latest version and copy the files to your home folder.

```bash
git clone https://github.com/mathiasbynens/dotfiles.git && cd dotfiles && source bootstrap.sh
```

To update, `cd` into your local `dotfiles` repository and then:

```bash
source bootstrap.sh
```

Alternatively, to update while avoiding the confirmation prompt:

```bash
set -- -f; source bootstrap.sh
```

### Git-free install

To install these dotfiles without Git:

```bash
cd; curl -#L https://github.com/mathiasbynens/dotfiles/tarball/master | tar -xzv --strip-components 1 --exclude={README.md,bootstrap.sh,.osx,LICENSE-MIT.txt}
```

To update later on, just run that command again.

### Specify the `$PATH`

If `~/.path` exists, it will be sourced along with the other files, before any feature testing (such as [detecting which version of `ls` is being used](https://github.com/mathiasbynens/dotfiles/blob/aff769fd75225d8f2e481185a71d5e05b76002dc/.aliases#L21-26)) takes place.

Here’s an example `~/.path` file that adds `/usr/local/bin` to the `$PATH`:

```bash
export PATH="/usr/local/bin:$PATH"
```

### Add custom commands without creating a new fork

If `~/.extra` exists, it will be sourced along with the other files. You can use this to add a few custom commands without the need to fork this entire repository, or to add commands you don’t want to commit to a public repository.

My `~/.extra` looks something like this:

```bash
# Git credentials
# Not in the repository, to prevent people from accidentally committing under my name
GIT_AUTHOR_NAME="Mathias Bynens"
GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
git config --global user.name "$GIT_AUTHOR_NAME"
GIT_AUTHOR_EMAIL="mathias@mailinator.com"
GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"
git config --global user.email "$GIT_AUTHOR_EMAIL"
```

You could also use `~/.extra` to override settings, functions and aliases from my dotfiles repository. It’s probably better to [fork this repository](https://github.com/mathiasbynens/dotfiles/fork) instead, though.

### Sensible macOS defaults

When setting up a new Mac, you may want to set some sensible macOS defaults:

```bash
./.macos
```

### Install Homebrew formulae

When setting up a new Mac, you may want to install some common [Homebrew](https://brew.sh/) formulae (after installing Homebrew, of course):

```bash
./brew.sh
```

Some of the functionality of these dotfiles depends on formulae installed by `brew.sh`. If you don’t plan to run `brew.sh`, you should look carefully through the script and manually install any particularly important ones. A good example is Bash/Git completion: the dotfiles use a special version from Homebrew.

## Feedback

Suggestions/improvements
[welcome](https://github.com/mathiasbynens/dotfiles/issues)!

## Author

| [![twitter/mathias](http://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](http://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](https://mathiasbynens.be/) |

## Thanks to…

* @ptb and [his _macOS Setup_ repository](https://github.com/ptb/mac-setup)
* [Ben Alman](http://benalman.com/) and his [dotfiles repository](https://github.com/cowboy/dotfiles)
* [Cătălin Mariș](https://github.com/alrra) and his [dotfiles repository](https://github.com/alrra/dotfiles)
* [Gianni Chiappetta](https://butt.zone/) for sharing his [amazing collection of dotfiles](https://github.com/gf3/dotfiles)
* [Jan Moesen](http://jan.moesen.nu/) and his [ancient `.bash_profile`](https://gist.github.com/1156154) + [shiny _tilde_ repository](https://github.com/janmoesen/tilde)
* [Lauri ‘Lri’ Ranta](http://lri.me/) for sharing [loads of hidden preferences](http://osxnotes.net/defaults.html)
* [Matijs Brinkhuis](https://matijs.brinkhu.is/) and his [dotfiles repository](https://github.com/matijs/dotfiles)
* [Nicolas Gallagher](http://nicolasgallagher.com/) and his [dotfiles repository](https://github.com/necolas/dotfiles)
* [Sindre Sorhus](https://sindresorhus.com/)
* [Tom Ryder](https://sanctum.geek.nz/) and his [dotfiles repository](https://sanctum.geek.nz/cgit/dotfiles.git/about)
* [Kevin Suttle](http://kevinsuttle.com/) and his [dotfiles repository](https://github.com/kevinSuttle/dotfiles) and [macOS-Defaults project](https://github.com/kevinSuttle/macOS-Defaults), which aims to provide better documentation for [`~/.macos`](https://mths.be/macos)
* [Haralan Dobrev](https://hkdobrev.com/)
* Anyone who [contributed a patch](https://github.com/mathiasbynens/dotfiles/contributors) or [made a helpful suggestion](https://github.com/mathiasbynens/dotfiles/issues)
=======
bash-oo-framework
=================
=======
Bash Infinity Framework
=======================

This is a boilerplate framework for writing tools using **bash**. 
It's highly modular and lightweight, while managing to implement some concepts from C#, Java or JavaScript into bash. 
The Infinity Framework is also plug & play: include it at the beginning of your existing script to get error handling benefits, and start using other features gradually.

Disclaimer: Not all of the modules work with earlier versions of bash, as I test primarily with **bash 4**. However, it should be possible (and relatively easy) to port non-working parts to earlier versions.

Main features
=============

* automatic error handling with exceptions
* named parameters in functions (instead of $1, $2...)
* **try-catch** implementation
* throwing custom **exceptions**
* **import** keyword for clever sourcing of scripts à la *require-js*
* handy aliases for **colors** and **powerline** characters to increase readability in the output of your scripts
* well-formatted, colorful **debug logging** to *stderr*
* *optional*: **unit test** library
* *optional*: **type system** for object-oriented scripting
* *optional*: basic classes for the type system, such as *Array* or *String* with useful functions

Most of the features are modular and it's easy to extract them for use without the rest of the framework. For example, the named parameters module is self-contained in one file.

Error handling with exceptions and ```throw```
==============================================

One of the highlight features is error handling that should work out of the box. If the script generates an error it will break and display a call stack:

![example call stack](https://raw.githubusercontent.com/niieani/bash-oo-framework/master/docs/exception.png "Example Call Stack")

You may force an error by ```throw```ing your own Exception:

```bash
throw "The hard disk is not connected properly!"
```

It's useful for debugging, as you'll also get the call stack if you're not sure where the call is coming from.

*Exceptions* combined with *try & catch* give you safety without having to run with **-o errexit**.
If you do something wrong, you'll get a detailed exception, highlighting the command where it went wrong in the line from the source, along with a backtrace the script will be halted with the option to continue of break.
On the other hand if you expect a part of block to fail, you can wrap it in a try block, and handle the error inside a catch block. 

Named parameters in functions
=============================

In any programing language, it makes sense to use meaningful names for variables for greater readability.
In case of Bash, that means avoiding using positional arguments in functions.
Instead of using the unhelpful ```$1```, ```$2``` and so on within functions to accessed the passed values, you may write:

```bash
testPassingParams() {

    @var hello
    @array[4] anArrayWithFourElements
    l=2 @array anotherArrayWithTwo
    @var anotherSingle
    @reference table   # references only work in bash >=4.3
    @params anArrayOfVariedSize

    test "$hello" = "$1" && echo correct
    #
    test "${anArrayWithFourElements[0]}" = "$2" && echo correct
    test "${anArrayWithFourElements[1]}" = "$3" && echo correct
    test "${anArrayWithFourElements[2]}" = "$4" && echo correct
    # etc...
    #
    test "${anotherArrayWithTwo[0]}" = "$6" && echo correct
    test "${anotherArrayWithTwo[1]}" = "$7" && echo correct
    #
    test "$anotherSingle" = "$8" && echo correct
    #
    test "${table[test]}" = "works"
    table[inside]="adding a new value"
    #
    # I'm using * just in this example:
    test "${anArrayOfVariedSize[*]}" = "${*:10}" && echo correct
}

fourElements=( a1 a2 "a3 with spaces" a4 )
twoElements=( b1 b2 )
declare -A assocArray
assocArray[test]="works"

testPassingParams "first" "${fourElements[@]}" "${twoElements[@]}" "single with spaces" assocArray "and more... " "even more..."

test "${assocArray[inside]}" = "adding a new value"
```

The system will automatically map:
 * **$1** to **$hello**
 * **$anArrayWithFourElements** will be an array of params with values from $2 till $5
 * **$anotherArrayWithTwo** will be an array of params with values from $6 till $7
 * **$8** to **$anotherSingle**
 * **$table** will be a reference to the variable whose name was passed in as the 9th parameter
 * **$anArrayOfVariedSize** will be a bash array containing all the following params (from $10 on)

In other words, not only you can call your parameters by their names (which makes up for a more readable core), you can actually pass arrays easily (and references to variables - this feature needs bash >=4.3 though)! Plus, the mapped variables are all in the local scope. 
This module is pretty light and works in bash 3 and bash 4 (except for references - bash >=4.3) and if you only want to use it separately from this project, get the file /lib/system/02_named_parameters.sh.

Note: Between 2-10 there are aliases for arrays like ```@array[4]```, after 10 you need to write ```l=LENGTH @array```, like shown in the example. Or, make your own aliases :).

Using ```import```
==================

You may use ```import``` to load your own files. 
It will ensure they're only loaded once. You may either use a relative path from the file you're importing, a path relative to the file that first included the framework, or an absolute path. ```.sh``` suffix is optional.
You can also load all the files inside of a directory by simply including the path to that directory instead of the file.

Using ```try & catch```
=======================

Simple usage:

```bash
try {
    # something...
    cp ~/test ~/test2
    # something more...
} catch {
    echo "The hard disk is not connected properly!"
    echo "Caught Exception:$(UI.Color.Red) $__BACKTRACE_COMMAND__ $(UI.Color.Default)"
    echo "File: $__BACKTRACE_SOURCE__, Line: $__BACKTRACE_LINE__"
    
    ## printing a caught exception couldn't be simpler, as it's stored in "${__EXCEPTION__[@]}"
    Exception.PrintException "${__EXCEPTION__[@]}"
}
```

If any command fails (i.e. returns anything else than 0) in the ```try``` block, the system will automatically start executing the ```catch``` block.
Braces are optional for the ```try``` block, but required for ```catch``` if it's multiline.

Note: ```try``` is executed in a subshell, therefore you cannot assign any variables inside of it.

Using Basic Logging, Colors and Powerline Emoji
===============================================

```bash
# using colors:
echo "$(UI.Color.Blue)I'm blue...$(UI.Color.Default)"

# enable basic logging for this file
namespace myApp
Log.AddOutput myApp DEBUG

# now we can write with the DEBUG output set
Log "Play me some Jazz, will ya? $(UI.Powerline.Saxophone)"

# redirect error messages to STDERR
Log.AddOutput error STDERR
subject=error Log "Something bad happened."

# reset outputs
Log.ResetAllOutputsAndFilters

# You may also hardcode the use for the StdErr output directly:
Console.WriteStdErr "This will be printed to STDERR, no matter what."
```

Both the colors and the powerline characters fallback gracefully on systems that don't support them.
To see powerline, you'll need to use a powerline-patched font though.

For the list of available colors and emoji's take a look into [lib/system/ui.sh](https://github.com/niieani/bash-oo-framework/blob/master/lib/system/01_ui.sh).
Fork and contribute more!

See [Advanced Logging](#advanced-logging) below to learn more about logging capabilities.

Writing Unit Tests
==================

![unit tests](https://raw.githubusercontent.com/niieani/bash-oo-framework/master/docs/unit.png "Unit tests for the framework itself")

Similarly to [Bats](https://github.com/sstephenson/bats), you can use the unit test module to test Bash scripts or any UNIX program.
Test cases consist of standard shell commands. Like Bats, Infinity Framework uses Bash's errexit (set -e) option when running test cases. Each test is run in a subshell, and is independent from one another. To quote from Bats:

> If every command in the test case exits with a 0 status code (success), the test passes. In this way, each line is an assertion of truth.

If you need to do more advanced testing, or need to be able to run your tests on shells other than bash 4, I'd still recommend Bats.

Example usage (taken from tests/run-tests.sh):
   
```bash
it 'should make a number and change its value'
try
    Number aNumber = 10
    aNumber = 12
    aNumber.Equals 12
    ## note: it's possible to compare with '==' operator too
    ##       as they both invoke the same __equals__ method on the object
expectPass

it "should make basic operations on two arrays"
try
    Array Letters
    Array Letters2

    Letters.Add "Hello Bobby"
    Letters.Add "Hello Maria"
    
    Letters.Contains "Hello Bobby"
    Letters.Contains "Hello Maria"

    Letters2.Add "Hello Midori,
                  Best regards!"

    lettersRef=$(Letters)
    Letters2.Merge "${!lettersRef}"

    Letters2.Contains "Hello Bobby"
expectPass
```

Can you believe this is bash?! ;-)

Using types (Object-Oriented module)
====================================

```bash
(
    # create an object someString of type String and immediately call it's setter with a parameter
    String someString = "My 123 name is Bazyli"
    
    # prints Match nr. 0 for the said regex:
    someString.RegexMatch '([\d]+) name' 0
    
    # prints a sanitized version of the variable:
    someString.GetSanitizedVariableName
    
    # calls the getter - here it prints the value
    someString
)
# someString doesn't exist here
```

If you don't want the objects to fall through or collide, use them in a subshell.
For more, take a look at the examples inside of the unit tests above.

Advanced Logging
================

Here's an example of how to use the power of advanced logging provided by the Infinity Framework.

In every file you are logging from, you may name the logging scope (namespace).
If you won't do it, it'll be the filename, minus the extension.
It's better to name though, as filenames can conflict.
Thanks to scopes, you can specify exactly what and how you want to log.

```bash
namespace myApp

## ADD OUTPUT OF "myApp" TO DELEGATE STDERR
Log.AddOutput myApp STDERR

## LET'S TRY LOGGING SOMETHING:
Log "logging to stderr"
```

The above will simply print "logging to stderr" to STDERR.
As you saw we used the logger output called "STDERR". It is possible to create and register your own loggers:

```bash
## LET'S MAKE A CUSTOM LOGGER:
myLoggingDelegate() {
    echo "Hurray: $*"
}

## WE NEED TO REGISTER IT:
Log.RegisterLogger MYLOGGER myLoggingDelegate
```

Now, we can set it up so that it direct only logs from a specific function to the our custom logger output:

```bash
## WE WANT TO DIRECT ALL LOGGING WITHIN FUNCTION myFunction OF myApp TO MYLOGGER
Log.AddOutput myApp/myFunction MYLOGGER

## LET'S DECLARE THAT FUNCTION:
myFunction() {
    echo "Hey, I am a function!"
    Log "logging from myFunction"
}

## AND RUN:
myFunction
```

The above code should print:

```
Hey, I am a function!
Hurray: logging from myFunction
```

As you can see, logging automatically redirected the logger from our function from our previously registered STDERR to our more specifically defined MYLOGGER.
If you wish to keep logging to both loggers, you can disable the specificity filter:

```bash
Log.DisableFilter myApp 
```

Now if we run the function ```myFunction```:

The output will be:

```
Hey, I am a function!
Hurray: logging from myFunction
logging from myFunction
```

We can be even more specific and redirect messages with specific *subjects* to other loggers, or mute them altogether:

```bash
## Assuming we're in the same file, let's reset first
Log.ResetAllOutputsAndFilters

Log.AddOutput myApp/myFunction MYLOGGER

myFunction() {
    echo "Hey, I am a function!"
    Log "logging from myFunction"
    subject="unimportant" Log "message from myFunction"
}
```

And let's change our custom logger a little, to support the subject:

```bash
myLoggingDelegate() {
    echo "Hurray: $subject $*"
}
```

Now when we run ```myFunction```, we should get:

```
Hey, I am a function!
Hurray:  logging from myFunction
Hurray: unimportant message from myFunction
```

To filter (or redirect) messages with subject ```unimportant``` within ```myFunction``` of ```myApp```'s file:

```bash
Log.AddOutput myApp/myFunction/unimportant VOID
```

To filter any messages with subject ```unimportant``` within ```myApp```'s file:

```bash
Log.AddOutput myApp/unimportant VOID
```

Or any messages with subject ```unimportant``` anywhere:

```bash
Log.AddOutput unimportant VOID
```

Now, running ```myFunction``` will print:

```
Hey, I am a function!
Hurray: logging from myFunction
```

Writing your own classes
========================

It's really simple and straight-forward, like with most object-oriented languages.

Keywords for definition:

* **class:YourName()** - defining a class
* **static:YourName()** - defining a static class (singleton types)

Keywords to use inside of the class definition:

* **extends SomeClass** - As the name suggests - inherit from a base class
* **method ClassName::FunctionName()** - Use for defining methods that have access to *$this*
* **static ClassName.StaticFunctionName()** - static methods inside of non-static classes
* **public Type yourProperty** - define public properties (works in all types of classes)
* **private Type yourProperty** - as above, but accessible only for internal methods
* **$this** - Contains the name of the instance and makes it possible to call it's own methods or access it's own properties

If you want to call a base method that you overrode, just call it with the name of the base instead of **$this** and with ```::``` before method's name, instead of ```.```.

**IMPORTANT: If you don't load the classes with ```import``` you need to call ```Type.Load``` after you declare your classes. However, the order of loading will not be the order in which they were declared, so you may need to call it after every class definition so you may to inherit from previously loaded classes.** 

Here's an example that shows how to define your own classes:

```bash
import lib/types/base

class:Animal() {
    extends Object

    method Animal::__getter__() {
        echo "That is the animal"
    }
} 

class:Human() {
    extends Animal

    public Number Height
    public Array Eaten
    public String Name

    method Human::__toString__() {
        echo "I'm a human called $($this.Name), $($this.Height) cm tall."
    }

    method Human::__getter__() {
        $this.__toString__
    }
    
    method Human::CallBaseGetter() {
        Animal::__getter__
    }

    method Human::Eat() {
        @var food
                
        $this.Eaten.Add "$food"
        
        echo "$this is eating $food, which is the same as $1"
    }
    
    method Human::WhatDidYouEat() {
        $this.Eaten.List
    }

    method Human::Example() {
        @Array      someArray
        @Number     someNumber
        @params     arrayOfOtherParams
                
        echo "Testing $someArray and $someNumber"
        echo Stuff: "${arrayOfOtherParams[*]}"
    }

    method Human::__equals__() {
        echo 'TODO: Checking if $this equals $1'
    }

    method Human::__constructor__() {
        @String name
        @Number height
                
        $this.Name = "$name"
        $this.Height = "$height"
        
        Console.WriteStdErr "Hello, I am the constructor! You have passed these arguments [ $@ ]"
    }
        
    static Human.PlaySomeJazz() {
        # this is a static method
        echo "$(UI.Powerline.Saxophone)"
    }
}

static:SingletonExample() {
    extends Var

    Number YoMamaNumber = 150

    Singleton::__constructor__() {
        echo "Yo Yo. I'm a singleton. Meaning. Static. Yo."
        Singleton = "Yo Mama!"
    }

    Singleton.PrintYoMama() {
        ## prints the stored value, which is set in the constructor above
        echo "$(SingletonExample) Number is: $(SingletonExample.YoMamaNumber)!"
    }
}
```

How to use?
===========

1. Clone or download this repository. You'll only need the **/lib/** directory.
2. Make a new script just outside of that directory and at the top place this:

    ```shell
    #!/usr/bin/env bash
    source "$( cd "${BASH_SOURCE[0]%/*}" && pwd )/lib/oo-framework.sh"
    ```

3. You may of course change the name of the **/lib/** directory to your liking, just change it in the script too.
4. Out-of-box you'll get the core functionality described above, such as exceptions, try&catch, and so on.
   However, if you wish to add more features, like enable the typing system, you'll need to import those modules:
   
   ```shell
   # load the type system
   import lib/type-core
   
   # load some basic types, such as Var, Array or String
   import lib/types/base
   ```

5. To import the unit test library you'll need to ```import lib/types/util/test```.
   The first error inside of the test will make the whole test fail.
   
6. Don't use ```set -o errexit``` or ```set -e``` - it's not necessary, because error handling is done by the framework itself.

Contributing
============

Feel free to fork, suggest changes or new modules and file a pull request.
The two features that I'd love to add are:
* port to bash 3 (preferably a dynamic one, that imports the right file for the right version)
* a web generator for a single file version of the boilerplate (with an option to select modules of your choice)

More functions for simple types (arrays, strings, numbers) and more types in general, are very welcome too.

Acknowledgments
===============

If a function's been adapted or copied from the web or any other libraries out there, I always mention it in a comment within the code.

Additionally, I took some inspiration from other object-oriented bash libraries:

* https://github.com/tomas/skull/
* https://github.com/domachine/oobash/
* https://github.com/metal3d/Baboosh/
* http://sourceforge.net/p/oobash/
* http://lab.madscience.nl/oo.sh.txt
* http://unix.stackexchange.com/questions/4495/object-oriented-shell-for-nix
* http://hipersayanx.blogspot.sk/2012/12/object-oriented-programming-in-bash.html

More bash goodness:

* http://kvz.io/blog/2013/11/21/bash-best-practices/
* http://www.davidpashley.com/articles/writing-robust-shell-scripts/
* http://qntm.org/bash
