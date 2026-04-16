# Generated for envman. Do not edit.

touch -a ~/.config/envman/PATH.env
touch -a ~/.config/envman/ENV.env
touch -a ~/.config/envman/alias.env
touch -a ~/.config/envman/function.fish

not set -q ENVMAN_LOAD; and source ~/.config/envman/ENV.env
not set -q ENVMAN_LOAD; and source ~/.config/envman/PATH.env

set -x ENVMAN_LOAD 'loaded'

not set -q g_envman_load_fish; and source ~/.config/envman/function.fish
not set -q g_envman_load_fish; and source ~/.config/envman/alias.env

set -g g_envman_load_fish 'loaded'
