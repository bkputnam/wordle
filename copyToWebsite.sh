#!/usr/bin/env bash

BIN='./bin'
SRC='./src'
DEST='../brian-putnam.com/www/wordle'

files=(compare iter state_filters wordlist state_filters)

npm run build
for i in "${files[@]}"; do
    cmd="cp $BIN/$i.js $DEST/"
    echo $cmd
    $($cmd)

    cmd="cp $SRC/$i.ts $DEST/"
    echo $cmd
    $($cmd)

    cmd="cp $BIN/$i.js.map $DEST/"
    echo $cmd
    $($cmd)
done

