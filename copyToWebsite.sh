#!/usr/bin/env bash

SRC='./bin'
DEST='../brian-putnam.com/www/wordle'

npm run build
cp $SRC/compare.js $DEST/
cp $SRC/iter.js $DEST/
cp $SRC/state_filters.js $DEST/
cp $SRC/wordlist.js $DEST/
cp $SRC/state_filters.js $DEST/

