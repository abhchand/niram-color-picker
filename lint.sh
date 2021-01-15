#!/bin/sh

# Run linters against the codebase. Intended for use with githooks,
# but can be run standalone as well.
#
# It runs each linter against every (relevant) file in the codebase.
#
# This script supports the following command line options:
#
#   -s   Run only against git staged files
#   -f   Fix/write any errors where possible
#

while getopts sf option
do
case "${option}"
in
s) RUN_ONLY_STAGED_FILES=1;;
f) FIX_FILES=1;;
esac
done

run_cmd () {
  echo "\n\033[0;32m$1\033[0m"
  eval $1
  if [ $? -ne 0 ]; then
    echo "\033[0;31m❌ $2 failed - exiting.\033[0m";
    exit 1;
  else
    echo "\033[0;32m✅ $2 succeeded\033[0m"
  fi
}

#
# PrettierJS
#

PRETTIER="npx prettier"
FILES="src/js/\*"
OPTS=""
HAS_FILES=1

if [ "$RUN_ONLY_STAGED_FILES" = 1 ]; then
  HAS_FILES=0
  FILES=""
  for file in $(git diff --diff-filter=d --cached --name-only | grep "\.js"); do
    FILES="${FILES} $file"
    HAS_FILES=1
  done
fi

if [ "$FIX_FILES" = 1 ]; then OPTS="$OPTS --write"; else OPTS="$OPTS --check"; fi

CMD="$PRETTIER $OPTS $FILES"
echo $CMD
if [ "$HAS_FILES" = 1 ]; then run_cmd "$CMD" "prettier"; fi


#
# Eslint
#

ESLINT="npx eslint"
FILES="."
OPTS='--ext .js,.jsx'
HAS_FILES=1

if [ "$RUN_ONLY_STAGED_FILES" = 1 ]; then
  HAS_FILES=0
  FILES=""
  for file in $(git diff --diff-filter=d --cached --name-only | grep "\.js"); do
    FILES="${FILES} $file"
    HAS_FILES=1
  done
fi

if [ "$FIX_FILES" = 1 ]; then OPTS="$OPTS --fix"; fi

CMD="$ESLINT $OPTS $FILES"
if [ "$HAS_FILES" = 1 ]; then run_cmd "$CMD" "eslint"; fi


#
# Stylelint
#

STYLELINT="npx stylelint"
FILES="src/styles/*"
OPTS=""
HAS_FILES=1

if [ "$RUN_ONLY_STAGED_FILES" = 1 ]; then
  HAS_FILES=0
  FILES=""
  for file in $(git diff --diff-filter=d --cached --name-only | grep "\.scss"); do
    FILES="${FILES} $file"
    HAS_FILES=1
  done
fi

if [ "$FIX_FILES" = 1 ]; then OPTS="$OPTS --fix"; fi

CMD="$STYLELINT $OPTS $FILES"
if [ "$HAS_FILES" = 1 ]; then run_cmd "$CMD" "stylelint"; fi

exit 0
