#!/bin/bash

# download nave, a node version management tool
wget http://github.com/isaacs/nave/raw/master/nave.sh

# give yourself permission to run the script
sudo chmod 755 /usr/local/bin/nave

# Point command line’s “nave” to run the script
sudo ln -s $PWD/nave.sh /usr/local/bin/nave

# starts virtual environment with node & npm 
nave use stable

# start environment on future logins as well
echo 'nave use stable' >> ~/.bashrc