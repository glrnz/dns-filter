# dn_server
Caching DNS with filtering

# Pre-requisite software
  -nodejs<br>
  -npm
# Packages outside package.json
   -forever  
   -forever-service

# Installation
      npm install  
      npm install -g forever forever-service  

# Create a service  
  Make sure you are in your working directory  
  
         sudo forever-service install dnsfilter --script dns-server.js
         
 Or with error checking (not tested on linux).
 
        sudo forever-service install dnsfilter --script errorCheck.js
  
  output:
                      forever-service version 0.5.9

              Platform - CentOS Linux release 7.1.1503 (Core)

              dnsfilter provisioned successfully

              Commands to interact with service dnsfilter
              Start   - "sudo service dnsfilter start"
              Stop    - "sudo service dnsfilter stop"
              Status  - "sudo service dnsfilter status"
              Restart - "sudo service dnsfilter restart"



# You might run into problem regarding root priviledges.  
   Create symlinks to work with sudo priviledges.
  You can use sudoers account but make sure npm and node have symbolic links.
 
            sudo ln -s /usr/local/bin/node /usr/bin/node  
            sudo ln -s /usr/local/lib/node /usr/lib/node  
            sudo ln -s /usr/local/bin/npm /usr/bin/npm  
            sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf
            sudo ln -s /usr/local/n/versions/node/6.2.0/bin/forever-service /usr/bin/forever-service
            sudo ln -s /usr/local/n/versions/node/6.2.0/bin/forever /usr/bin/forever

#TO DO :)
- Add Main Program Configuration. (To set Blacklist or Whitelist mode)
- Reporting (to keep track of your network for management ease)
- Web GUI O.O
