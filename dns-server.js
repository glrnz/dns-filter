'use strict';

/**
 * Configuration -future it will have configuration file.
 */
// Whitelist
let TTL_FOR_BLOCK = 1800;
let IP_FOR_BLOCK = '218.50.181.110';
let authority = { address: '8.8.8.8', port: 53, type: 'udp' };
let whitelistConf = 'whitelist.conf'; //Make multiple whitelist config file for better whitelisting
                                        //for large scale dns *not really needed
//-------------------------- Read file for whitelist------------------//
let fs = require('fs');
let contents = fs.readFileSync( whitelistConf ).toString();
let list  = contents.split("\r\n");
let comment = /^#/;
let whitelist = [];
//populate whitelist array and remove comments
    list.forEach( ( val,index ) => {
        if ( val.match( comment ) || val == ""){
          whitelist.splice( index );
        }else{
          whitelist.push( val );
        }
    });
// ------------------------ Do not edit below -------------------------------

let dns = require('native-dns');
let server = dns.createServer();
let d = new Date();
let m = [ 'Jan','Feb','March','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec' ]
let date_event = ' '+d.getHours() + ':' + d.getMinutes() + ' ' + m[ d.getMonth() ] +'-'+ d.getDate() +'-'+d.getFullYear();

let server_address;
//Event Logging
  server.on('listening', () =>{
      fs.appendFile('log/event.log', '\nServer started... ' + server.address().address + date_event );
    console.log('Listening on... '+server.address().address + date_event);
  });
  server.on('close', () => 
    fs.appendFile('log/event.log','Server closed at:'+  date_event)
  );
  server.on('error', (err, buff, req, res) => 
    fs.appendFile( 'log/event.log', '\nError at '+ date_event +'Message:'+err.stack )
  );    //console.error(err.stack));
  server.on('socketError', (err, socket) =>  
    fs.appendFile('log/event.log', '\nSocket Error at ' + date_event + 'Message' +err) 
  );    //console.error(err));

server.serve(53);
//get current date and time for request logging.
function getDate(){
  let now = new Date();
 let date = ' '+ now.getHours() + ':' + now.getMinutes() + ' ' + m[now.getMonth()] +'-'+ now.getDate() +'-'+now.getFullYear();
return date;

}

function proxy( question, response, cb ) {
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
          fs.appendFile('log/passed.txt','\n'+ getDate() +' PASS: request from: ' + request.address.address + ' for: ' + question.name);
          fs.appendFile('log/data_log.txt','\n'+request.address.address + ' ' + question.name);
              f.push(cb => proxy(question, response, cb));

      }
      else { // or block it.
      //  console.log('BLOCK: request from: ', request.address.address, ' for: ', question.name);
          fs.appendFile('log/blocked.txt','\n'+ getDate() +' BLOCK: request from: ' + request.address.address + ' for: ' + question.name);
          fs.appendFile('log/data_log.txt', '\n'+request.address.address + ' ' + question.name);
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
  async.parallel(f, function() { response.send()  ; });
}
server.on('request', handleRequest);
