#!/bin/bash

rm -rf data
./generateData.js

jekyll s --watch &
JEKYLL_PID=$!

fswatch -o _wiki | xargs -n 1 sh -c 'rm -rf data; ./generateData.js' &
FSWATCH_PID=$!

trap "kill $FSWATCH_PID $JEKYLL_PID; exit" SIGINT

wait $FSWATCH_PID
wait $JEKYLL_PID
