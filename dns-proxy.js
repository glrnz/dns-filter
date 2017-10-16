'use strict';

/**
 * Configuration
 */
// Whitelist
let TTL_FOR_BLOCK = 1800;
let IP_FOR_BLOCK = '218.50.181.110';


//-------------------------- Read file for whitelist------------------//
let fs = require('fs');
let contents = fs.readFileSync('whitelist.conf').toString();
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
  // Since proxying is asynchronous, store all callback
  request.question.forEach(question => {
      fs.appendFile('log/passed.txt', '\nPASS: request from: ' + request.address.address + ' for: ' + question.name);
           fs.appendFile('log/data_log.txt', '\n'+request.address.address + ' ' + question.name);
              f.push(cb => proxy(question, response, cb));
  });
  // Do the proxying in parallel
  // when done, respond to the request by sending the response
  async.parallel(f, function() { response.send(); });
}


server.on('request', handleRequest);
