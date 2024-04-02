#compdef autogen.sh

_autogen_subcommands=(
    '-h:show help of this command'
    '--help:show help of this command'
    '-V:show version of this command'
    '--version:show version of this command'
    'upgrade:upgrade this software.'
    'integrate:integrate zsh-completions script for this command.'
    'env:show current machine os info and environment varables.'
    'configure:generate the configure shell script'
)

function _autogen() {
    local context state state_descr line
    typeset -A opt_args

    _arguments \
        '1: :{_describe 'autogen_subcommand' _autogen_subcommands}' \
        '*:: :->option'

    if [ "$state" = 'option' ] ; then
        case $words[1] in
            upgrade)
                _arguments \
                    '-x[trace execution of commands]' \
                    '--china[use china mirror url]'
                ;;
            integrate)
                _arguments \
                    '1:what:(zsh)' \
                    '-x[trace execution of commands]' \
                    '--china[use china mirror url]'
                ;;
            configure)
                _arguments \
                    '-x[xtrace]' \
                    '-d[debug]' \
                    '-rc-file=[sepecify rc-file]:rc-file:{_files -g "*.rc"}'
                                                ;;
        esac
    fi
}

_autogen $@
