#!/usr/bin/env bash

set -euo pipefail

find . -type d -name node_modules -prune -print -exec rm -rI {} \;
