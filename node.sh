#!/bin/bash

# let nave do all the hard work in a hidden directory
mkdir -p .nave && cd .nave

# create necessary folders and take ownership
sudo mkdir -p /usr/local/{share/man,bin,lib/node,include/node}

# download nave, a node version management tool
wget https://raw.github.com/isaacs/nave/master/nave.sh

# point command line’s “nave” to run the script
sudo ln -s $PWD/nave.sh /usr/local/bin/nave

# give yourself permission to run the script
sudo chmod 755 /usr/local/{share/man,bin,bin/nave,lib,lib/node,include/node}

# starts virtual environment with node & npm
nave usemain stable

# this is where the magic will happen
cd ../ && mkdir -p node_modules && cd node_modules

#Show user thank you message
echo 'ng.seed installed node & npm'