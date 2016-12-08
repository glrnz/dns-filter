'use strict';
// Configuration
// Whitelist
let TTL_FOR_BLOCK = 1800;
let IP_FOR_BLOCK = '218.50.181.110';
let authority = { address: '8.8.8.8', port: 53, type: 'udp' };
let whitelistConf = 'whitelist.conf'; 
//-------------------------- Read file for whitelist------------------
let fs = require('fs');
let contents = fs.readFileSync(whitelistConf).toString();
let list  = contents.split("\n");  //add \r so it will run smooth on windows
let comment = /^#/;
let whitelist = [];
//populate whitelist array and remove comments
    list.forEach( ( val,index ) => {
        if ( val.match( comment ) || val == "" ){
          //do nothing
        }else{
          whitelist.push( val );
        }
    });
  list = null;
// ------------------------ Do not edit below -------------------------------
let dns = require('native-dns');
let server = dns.createServer();
let month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function getDate(){
  let now = new Date();
  let date = ' '+ now.getHours() + ':' + now.getMinutes() + ' ' + month[ now.getMonth() ] +'-'+ now.getDate() +'-'+now.getFullYear();
return date;
}
let server_address;
//Event Logging
  server.on('listening', () =>{
    console.log('Listening on... '+server.address().address + getDate());
  });
  
  server.on('error', (err, buff, req, res) => console.error(err.stack));    
  server.on('socketError', (err, socket) => console.error(err));

server.serve(53);
//get current date and time for request logging.

function proxy( question, response, cb ) {
  var request = dns.Request({
    question: question, // Forward the query
    server: authority,  // Parent DNS server to get IP address of the request
    timeout: 3000
  });
  // when we get answers, append them to the response
  // When gets answers from Parent DNS, append it to response.
  request.on('message', (err, msg) => {
    msg.answer.forEach(a => response.answer.push(a));
  });

  request.on('end', cb);
  request.send();
}
let async = require('async');
function handleRequest(request, response) {
  let f = []; // Array of functions
  // Proxy all questions
  // Since proxying is asynchronous, store all callbacks
  //
  //RECEIVE REQUEST
  //
  request.question.forEach(question => {
      // Domains that you want allow.
        let entry = whitelist.filter( ( currentValue, index, arr ) => {
                if ( question.name.indexOf( currentValue ) != -1 ) return currentValue;
            });
          // When a domain matches in whitelist, response with real IP address.
        if (entry.length) {
              f.push(cb => proxy(question, response, cb));
        }
        else { // or block it.
                let record = {};
                record.name = question.name;
                record.ttl = TTL_FOR_BLOCK;
                record.address = IP_FOR_BLOCK;
                record.type = 'A';
                response.answer.push(dns['A'](record));
        }
  });

  async.parallel(f, function() { response.send()  ; });
}
server.on('request', handleRequest);
