#!/bin/bash

# download nave, a node version management tool
wget https://raw.github.com/isaacs/nave/master/nave.sh

# install latest stable version of node & npm
sudo ./nave.sh use stable

#move script into the new intallation folder
mv nave.sh .nave/nave.sh

# Make 'nave' command work without specifying a path
sudo ln -s $PWD/.nave/nave.sh /usr/local/bin/nave

# give permission to run the pathless command
sudo chmod 755 /usr/local/bin/nave

# start environment on future logins as well
echo 'nave use stable' >> ~/.bashrc

# this is where the magic will happen
mkdir node_modules && cd node_modules

#Show user thank you message
echo 'ng.seed installed node & npm. Use "rm -R .nave" to delete'