#!/usr/bin/env bash

SRC='./bin'
DEST='../brian-putnam.com/www/wordle'

files=(compare.js iter.js state_filters.js wordlist.js state_filters.js)

npm run build
for i in "${files[@]}"; do
    cmd="cp $SRC/$i $DEST/"
    echo $cmd
    $($cmd)

    cmd="cp $SRC/$i.map $DEST/"
    echo $cmd
    $($cmd)
done

