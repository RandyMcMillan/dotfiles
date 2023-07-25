#!/bin/bash
if hash brew 2>/dev/null; then
    brew remove --force $(brew list --formula)
fi
