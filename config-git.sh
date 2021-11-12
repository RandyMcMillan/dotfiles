#!/usr/bin/env bash
git config --global core.editor "vim"
git config --global commit.gpgsign true
git config --global core.ignorecase false
git config --global advice.addIgnoredFile false
git config --global pull.rebase true
git config pull.rebase true
git config --global alias.prune-branches-force '!git remote prune origin && git branch -vv | grep '"'"': gone]'"'"' | awk '"'"'{print $1}'"'"' | xargs git branch -D'
git config --global alias.prune-branches '!git remote prune origin && git branch -vv | grep '"'"': gone]'"'"' | awk '"'"'{print $1}'"'"' | xargs git branch -d'
