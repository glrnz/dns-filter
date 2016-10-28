'use strict';

/**
 * Configuration
 */
// Whitelist
let TTL_FOR_BLOCK = 1800;
let IP_FOR_BLOCK = '218.50.181.110';


//-------------------------- Read file for whitelist------------------//
let fs = require('fs');
let contents = fs.readFileSync('whitelist.txt').toString();
let whitelist  = contents.split("\r\n");


// ------------------------ Do not edit below -------------------------------

let dns = require('native-dns');
let server = dns.createServer();

server.on('listening', () => console.log('server listening on', server.address()));
server.on('close', () => console.log('server closed', server.address()));
server.on('error', (err, buff, req, res) => console.error(err.stack));
server.on('socketError', (err, socket) => console.error(err));

server.serve(53);


let authority = { address: '8.8.8.8', port: 53, type: 'udp' };

function proxy(question, response, cb) {
  //console.log('proxying', question.name);

  var request = dns.Request({
    question: question, // Forward the query
    server: authority,  // Parent DNS server to get IP address of the request
    timeout: 1000
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
//Use for Whitelisting
  request.question.forEach(question => {
      // Domains that you want allow.
      //let entry = whitelist.filter( r => new RegExp(r, 'i').exec(question.name));
      let entry = whitelist.filter( ( currentValue, index, arr ) => {
        if ( question.name.indexOf( currentValue ) != -1 ) return currentValue;
      });
      // When a domain matches in whitelist, response with real IP address.
      if (entry.length) {
      // console.log('PASS: request from: ', request.address.address, ' for: ', question.name);
     fs.appendFile('passed.txt', '\nPASS: request from: ' + request.address.address + ' for: ' + question.name);
     fs.appendFile('data_log.txt', '\n'+request.address.address + ' ' + question.name);
        f.push(cb => proxy(question, response, cb));
      }
      else { // or block it.
      //  console.log('BLOCK: request from: ', request.address.address, ' for: ', question.name);
        fs.appendFile('blocked.txt', '\nBLOCK: request from: ' + request.address.address + ' for: ' + question.name);
          let record = {};
          record.name = question.name;
          record.ttl = TTL_FOR_BLOCK;
          record.address = IP_FOR_BLOCK;
          record.type = 'A';
          response.answer.push(dns['A'](record));
    }
  });

  // Do the proxying in parallel
  // when done, respond to the request by sending the response
  async.parallel(f, function() { response.send(); });
}


server.on('request', handleRequest);