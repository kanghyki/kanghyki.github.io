.PHONY: help setup data dev build clean-data clean

help:
	@echo "make setup       # install ruby deps"
	@echo "make data        # generate data/ artifacts"
	@echo "make dev         # run local dev server"
	@echo "make build       # build site into _site"
	@echo "make clean-data  # remove generated data/"
	@echo "make clean       # remove _site and data/"

setup:
	bundle install

data:
	node ./generateData.js

dev:
	./jekyll-run.sh

build:
	node ./generateData.js
	bundle exec jekyll build -d _site

clean-data:
	rm -rf data

clean:
	rm -rf _site data
