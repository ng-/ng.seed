#!/bin/bash

# download nave, a node version management tool
wget https://raw.github.com/isaacs/nave/master/nave.sh

# Point command line’s “nave” to run the script
sudo ln -s $PWD/nave.sh /usr/local/bin/nave

# give yourself permission to run the script
sudo chmod 755 /usr/local/bin/nave

# starts virtual environment with node & npm
nave use

# start environment on future logins as well
echo 'nave use stable' >> ~/.bashrc

# this is where the magic will happen
mkdir node_modules && cd node_modules

#Show user thank you message
echo 'ng.seed has successfully installed node & npm'