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
  Make sure you are in your working directory  
  -sudo forever-service install dnsfilter --script dns-server.js


# You might run into problem regarding root priviledges.  
# Create symlinks to work with sudo priviledges.
  You can use sudoers account but make sure npm and node have symbolic links.
  sudo ln -s /usr/local/bin/node /usr/bin/node  
  sudo ln -s /usr/local/lib/node /usr/lib/node  
  sudo ln -s /usr/local/bin/npm /usr/bin/npm  
  sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf
  sudo ln -s /usr/local/n/versions/node/6.2.0/bin/forever-service /usr/bin/forever-service
  sudo ln -s /usr/local/n/versions/node/6.2.0/bin/forever /usr/bin/forever
