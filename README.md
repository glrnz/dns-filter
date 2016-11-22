# dn_server
Caching DNS with filtering

# Pre-requisite software
  -nodejs<br>
  -npm
# Packages outside package.json
  -forever  
  -forever-service

# Installation
  -npm install<br>
  -npm install -g forever forever-service  

# Create a service
  -sudo forever-service install test --script main.js


# You might run into problem regarding root priviledges.
  You can use sudoers account but make sure npm and node have symbolic links.
  sudo ln -s /usr/local/bin/node /usr/bin/node  
  sudo ln -s /usr/local/lib/node /usr/lib/node  
  sudo ln -s /usr/local/bin/npm /usr/bin/npm  
  sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf
