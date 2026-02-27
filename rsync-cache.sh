#!/usr/bin/env bash
mkdir -p $HOME/.cache
HOME_CACHE=$HOME/.cache/
rsync -avlr ./.cache/** $HOME_CACHE
rsync -avlr ./.cache/cargo/** $HOME_CACHE/cargo/
