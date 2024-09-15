#!/bin/bash

rm -rf data
./generateData.js
jekyll $@
